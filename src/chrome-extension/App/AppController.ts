import { TApiForm } from '../common/type.form';
import { actions, UIStateContext, UIStateDispatch } from '../AppState';
// import confirmationEmailJson from './confirmationEmail.json';
// import notificationEmailJson from './notificationEmail.json';
// import webhookJson from './webhook.json';
import { FsFormModel } from '../../formstack';
import { FormAnalytics } from '../../FormstackBuddy/FormAnalytics';
import { FieldLogicService } from '../../FormstackBuddy/FieldLogicService';
import { transformers } from '../../formstack/transformers';
import { TFsNotificationEmailLogicJson } from '../../formstack/type.notification';
import { TOffFormLogicEntity, UIStateType } from '../AppState/types';

const backendResponse = <T>(backendMessage: any): Promise<T> => {
  // const webhooksAsPromised = () => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(backendMessage, async (apiWebhookJson) => {
      // need reject somewhere, probably?
      resolve(apiWebhookJson);
    });
  });
  //   };
};

class AppController {
  static #instance: AppController;
  private constructor() {}

  public async setStateFromApiJson(
    apiKey: string,
    apiFormJson: TApiForm,
    context: UIStateType, // Context<UIStateType>,
    dispatcher: Function
  ): Promise<void> {
    // ---------------------------
    const formId = apiFormJson.id;
    const webhookJson = await backendResponse({
      type: 'GetWebhooksAsJson',
      fetchFormId: formId,
      apiKey: apiKey,
    });
    console.log({ webhookJson });

    const notificationEmailJson = await backendResponse({
      type: 'GetNotificationEmailsAsJson',
      fetchFormId: formId,
      apiKey: apiKey,
    });
    console.log({ notificationEmailJson });

    const confirmationEmailJson = await backendResponse({
      type: 'GetConfirmationEmailsAsJson',
      fetchFormId: formId,
      apiKey: apiKey,
    });
    console.log({ confirmationEmailJson });

    const formModel = FsFormModel.fromApiFormJson(apiFormJson);

    const formAnalytic = new FormAnalytics(apiFormJson);
    const fieldLogicService = new FieldLogicService(apiFormJson);
    const fieldSummary = fieldLogicService?.getAllFieldSummary();

    if (apiFormJson.id) {
      // @ts-ignore notificationEmailJson json unknown type
      const notifications = notificationEmailJson.notifications.map(
        (notification: any) => {
          const agTree = formModel.aggregateOffFormLogicJson(
            // @ts-ignore - type
            notification.logic
            // transformers.notificationEmailLogicJson(notification.logic)
          );
          const pojo = agTree ? agTree.toPojoAt(undefined, false) : {};

          const graphMap = transformers.pojoToD3TableData(pojo, formModel);
          const emailProps =
            notification as unknown as TFsNotificationEmailLogicJson;
          return {
            // @ts-ignore id not a property
            id: 'NE-' + (emailProps.id || '_NO_NOTIFICATION_EMAIL_ID'),
            // @ts-ignore name not a property
            name: '[NE]' + notification.name || emailProps?.name,

            // emailNotificationProperties:
            //   notification as unknown as TFsNotificationEmailLogicJson,
            graphMap,
            statusMessages: agTree?.getStatusMessage(),
            entityType: 'notificationEmail',
          };
        }
      ) as TOffFormLogicEntity[];

      // @ts-ignore notificationEmailJson json unknown type
      const confirmations = confirmationEmailJson.confirmations.map(
        (confirmation: any) => {
          const agTree = formModel.aggregateOffFormLogicJson(
            // @ts-ignore - type
            confirmation.logic
            // transformers.notificationEmailLogicJson(notification.logic)
          );
          const pojo = agTree ? agTree.toPojoAt(undefined, false) : {};

          const graphMap = transformers.pojoToD3TableData(pojo, formModel);
          const emailProps =
            confirmation as unknown as TFsNotificationEmailLogicJson;
          return {
            // @ts-ignore id not a property
            id: 'CE-' + (emailProps.id || '_NO_CONFIRMATION_EMAIL_ID'),
            // @ts-ignore name not a property
            name: '[CE]' + confirmation.name || emailProps?.name,

            // emailNotificationProperties:
            //   notification as unknown as TFsNotificationEmailLogicJson,
            graphMap,
            statusMessages: agTree?.getStatusMessage(),
            entityType: 'confirmationEmail',
          };
        }
      ) as TOffFormLogicEntity[];
      // @ts-ignore Webhook json unknown type
      const webhooks = webhookJson.webhooks.map((webhook: any) => {
        const agTree = formModel.aggregateOffFormLogicJson(
          // @ts-ignore - type
          webhook.logic
          // transformers.notificationEmailLogicJson(notification.logic)
        );
        const pojo = agTree ? agTree.toPojoAt(undefined, false) : {};

        const graphMap = transformers.pojoToD3TableData(pojo, formModel);
        const webhookProps =
          webhook as unknown as TFsNotificationEmailLogicJson;
        return {
          // @ts-ignore id not a property
          id: 'WH-' + webhook.id,
          // @ts-ignore name not a property
          name: '[wh]' + webhook.name,

          // emailNotificationProperties:
          //   notification as unknown as TFsNotificationEmailLogicJson,
          graphMap,
          statusMessages: agTree?.getStatusMessage(),
          entityType: 'webhook',
        };
      }) as TOffFormLogicEntity[];

      const formLogic = fieldLogicService
        ?.getFieldIdsWithLogic()
        .map((fieldId) => {
          const statusMessages =
            fieldLogicService?.getStatusMessagesFieldId(fieldId);
          fieldLogicService?.getCircularReferenceFieldIds(fieldId);
          const logicalNodeGraphMap =
            fieldLogicService?.getLogicNodeGraphMap(fieldId);

          return {
            statusMessages,
            graphMap: logicalNodeGraphMap,
            id: 'field-' + fieldId,
            name: `[${fieldId}]` + fieldSummary[fieldId].label,
            entityType: 'formLogic',
          } as TOffFormLogicEntity;
        });

      const changeAction = {
        webhooks: webhooks,
        notificationEmails: notifications,
        confirmationEmails: confirmations,
        formLogic,
      };
      dispatcher(actions.offFormLogicLists.update(context, changeAction));
    }
  }

  static getInstance() {
    if (AppController.#instance === undefined) {
      AppController.#instance = new AppController();
    }
    return AppController.#instance;
  }
}

export { AppController };
