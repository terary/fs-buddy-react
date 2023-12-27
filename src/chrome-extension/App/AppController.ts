import type { TApiFormJson, TSubmissionJson } from '../../formstack';
import { actions } from '../AppState';
import { filterStatusMessages, keyIn } from '../../common/functions';
import {
  transformers,
  FsFormModel,
  FormAnalyticService,
  FieldLogicService,
} from '../../formstack';

import {
  TOffFormLogicEntity,
  UIStateApiResponseFormGetType,
  UIStateType,
} from '../AppState/types';

interface IOffFormLogic {
  id: string;
  name: string;
  logic: any;
}

type OffFormLogicEntityType =
  | 'notificationEmail'
  | 'confirmationEmail'
  | 'webhook';

// the API returns response {[APILogicEntityFieldKeys]: ArrayOfLogicItems}
type APILogicEntityFieldKeys = 'confirmations' | 'notifications' | 'webhooks';
const logicItemEntityToApiFieldKey = (
  entityType: OffFormLogicEntityType
): APILogicEntityFieldKeys => {
  switch (entityType) {
    case 'confirmationEmail':
      return 'confirmations';
    case 'notificationEmail':
      return 'notifications';
    case 'webhook':
      return 'webhooks';
    // default:
    //   return '??';
  }
};

const backendResponse = <T>(backendMessage: any): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(backendMessage, async (apiJson) => {
      // need reject somewhere, probably? (lastError ?)
      resolve(apiJson);
      return true; // I think this needs to be here?
    });
  });
};

class AppController {
  static #instance: AppController;
  private constructor() {}
  #apiKey!: string;
  #formModel!: FsFormModel;
  #fieldLogicService!: FieldLogicService;
  #FormAnalyticService!: FormAnalyticService;
  #formId!: string;

  public setApiKey(apiKey: string) {
    this.#apiKey = apiKey;
  }

  private async clearCache() {
    await backendResponse<TApiFormJson>({
      type: 'ClearCache',
    });
  }

  public async fetchFormAndSetState(
    // apiKey: string,
    formId: string,
    context: UIStateType, // Context<UIStateType>,
    dispatcher: Function
  ) {
    await this.clearCache();

    this.setFormId(formId);
    const apiFormJson = await backendResponse<TApiFormJson>({
      type: 'GetFormAsJson',
      fetchFormId: this.#formId,
      apiKey: this.#apiKey,
    });

    // @ts-ignore - status does not belong on formJson
    if (apiFormJson.status == 'error') {
      console.log({
        errorMessage: 'Error response from API.',
        apiFormJson,
      });
      return;
    }

    const formJson = transformers.formJson(apiFormJson);
    this.#FormAnalyticService = new FormAnalyticService(formJson);
    this.#formModel = FsFormModel.fromApiFormJson(formJson);
    this.#fieldLogicService = new FieldLogicService(formJson);

    await this.getOffFormLogicAndSetState(context, dispatcher);

    const fieldSummary =
      this.getFieldLogicServiceOrThrow().getAllFieldSummary();

    const formLogicStatusMessages =
      this.getFieldLogicServiceOrThrow().getFormLogicStatusMessages();

    const formStatusMessages =
      this.getFormAnalyticOrThrow().findKnownSetupIssues();

    const fieldIdsWithLogic =
      this.getFieldLogicServiceOrThrow().wrapFieldIdsIntoLabelOptionList(
        this.getFieldLogicServiceOrThrow().getFieldIdsWithLogic()
      ) || [];

    const allStatusMessages = [
      ...formStatusMessages,
      ...formLogicStatusMessages,
    ];

    const fieldStatusMessages = allStatusMessages.filter(
      (statusMessage) => statusMessage.fieldId
    );

    const payload: UIStateApiResponseFormGetType = {
      fieldSummary,
      formStatusMessages,
      formLogicStatusMessages,
      fieldStatusMessages,
      allStatusMessages,
      fieldIdsWithLogic,
      formHtml: apiFormJson.html || null,
      formJson: formJson,
    };

    dispatcher(actions.apiResponse.getForm(context, payload));

    dispatcher(
      actions.messageFilter.update(context, {
        selectedLogLevels: ['info', 'warn', 'error', 'logic'],
        filteredMessages: filterStatusMessages(allStatusMessages, [
          // 'debug',
          'info',
          'warn',
          'error',
          'logic',
        ]),
      })
    );
  }

  public async fetchSubmissionAndSetState(
    submissionId: string,
    stateContext: UIStateType,
    dispatcher: Function
  ) {
    const apiSubmissionJson = await backendResponse<TSubmissionJson>({
      type: 'GetSubmissionFromApiRequest',
      submissionId: submissionId,
      apiKey: this.#apiKey,
    });
    // async (apiSubmissionJson) => {
    if (keyIn('data', apiSubmissionJson)) {
      const submissionUiDataItems =
        this.getFormModelOrThrow().getUiPopulateObject(apiSubmissionJson);

      dispatcher(
        actions.submissionSelected.update(stateContext, {
          submissionId: apiSubmissionJson.id,
          submissionUiDataItems: submissionUiDataItems,
        })
      );
    } else {
      console.log({
        fetchSubmissionAndSetState: { error: apiSubmissionJson },
      });
    }
  }

  public async getOffFormLogicAndSetState(
    context: UIStateType,
    dispatcher: Function
  ): Promise<void> {
    const notifications = await this.fetchOffFormLogicItems(
      'GetNotificationEmailsAsJson',
      'notificationEmail'
    );

    const confirmations = await this.fetchOffFormLogicItems(
      'GetConfirmationEmailsAsJson',
      'confirmationEmail'
    );

    const webhooks = await this.fetchOffFormLogicItems(
      'GetWebhooksAsJson',
      'webhook'
    );
    console.log({ getOffFormLogicAndSetState: { webhooks, confirmations } });
    const formFieldLogic = this.extractFieldLogic();

    const changeActionPayload = {
      webhooks: webhooks,
      notificationEmails: notifications,
      confirmationEmails: confirmations,
      formLogic: formFieldLogic,
    };

    dispatcher(actions.offFormLogicLists.update(context, changeActionPayload));
  }

  public setFormId(formId: string) {
    this.#formId = formId;
  }

  private getFormIdOrThrow(): string {
    if (this.#formId === undefined) {
      throw new Error(
        'getFormIdOrThrow() failed because formId is not defined.'
      );
    }
    return this.#formId;
  }

  private extractFieldLogic(): TOffFormLogicEntity[] {
    const fieldSummary =
      this.getFieldLogicServiceOrThrow().getAllFieldSummary(); // do you need to call these every time?
    const logicService = this.getFieldLogicServiceOrThrow(); // do you need to call these every time?

    const formFieldLogic = this.getFieldLogicServiceOrThrow()
      .getFieldIdsWithLogic()
      .map((fieldId) => {
        const statusMessages = logicService.getStatusMessagesFieldId(fieldId);
        const logicalNodeGraphMap = logicService.getLogicNodeGraphMap(fieldId);

        return {
          statusMessages,
          graphMap: logicalNodeGraphMap,
          id: 'field-' + fieldId,
          name: `[${fieldId}]` + fieldSummary[fieldId].label,
          entityType: 'formLogic',
        } as TOffFormLogicEntity;
      });
    return formFieldLogic;
  }

  private async fetchOffFormLogicItems(
    backendActionType: string,
    logicEntityType: OffFormLogicEntityType
  ): Promise<TOffFormLogicEntity[]> {
    const apiFieldKey = logicItemEntityToApiFieldKey(logicEntityType);

    const logicItemJson = (await backendResponse({
      type: backendActionType,
      fetchFormId: this.getFormIdOrThrow(),
      apiKey: this.#apiKey,
    })) as { [apiFieldKey: string]: IOffFormLogic[] };

    const logicItems = logicItemJson[apiFieldKey].map((logicItem: any) =>
      transformers.offFormLogicJsonToLogic(
        logicItem,
        logicEntityType,
        this.getFormModelOrThrow()
      )
    ) as TOffFormLogicEntity[];
    return logicItems;
  }

  public getFormAnalyticOrThrow(): FormAnalyticService {
    if (this.#FormAnalyticService instanceof FormAnalyticService) {
      return this.#FormAnalyticService;
    }

    throw new Error(
      'Tried to access FormAnalyticService before appController initialized.'
    );
  }

  public getFormModelOrThrow(): FsFormModel {
    if (this.#formModel instanceof FsFormModel) {
      return this.#formModel;
    }
    throw new Error(
      'Tried to access formModel before appController initialized.'
    );
  }

  public getFieldLogicServiceOrThrow(): FieldLogicService {
    if (this.#fieldLogicService instanceof FieldLogicService) {
      return this.#fieldLogicService;
    }
    throw new Error(
      'Tried to access fieldLogicService before appController initialized.'
    );
  }

  static getInstance() {
    if (AppController.#instance === undefined) {
      AppController.#instance = new AppController();
    }
    return AppController.#instance;
  }
}

export { AppController };
