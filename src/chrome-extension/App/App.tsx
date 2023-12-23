import React, { useState, useEffect, useContext } from 'react';
import 'primereact/resources/themes/mira/theme.css';
import { actions, UIStateContext, UIStateDispatch } from '../AppState';
import './App.css';
import { filterStatusMessages, keyIn } from '../../common/functions';
import { FieldLogicService } from '../../FormstackBuddy/FieldLogicService';
import { FormAnalytics } from '../../FormstackBuddy/FormAnalytics';
import { transformers } from '../../formstack/transformers';
// import { FormstackBuddy } from '../../FormstackBuddy/FormstackBuddy';
import { MessageFilter } from '../../components/MessageFilter';
import { ApiKeyContainer } from '../pages/Content/ApiKeyContainer';
import { LogicFieldSelect } from '../pages/Content/LogicFieldSelect';
import { PrimeReactProvider } from 'primereact/api';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import ExpandedExpressionTreeGraph from '../../components/ExpandedExpressionTreeGraph/ExpandedExpressionTreeGraph';
import { FormView } from '../pages/Content/FormView/FormView';
import { FsFormModel, FsLogicTreeDeep } from '../../formstack';
import {
  TOffFormLogicEntity,
  UIStateApiResponseFormGetType,
} from '../AppState/types';
import { InputText } from 'primereact/inputtext';
import { Config } from '../../config';
import { TFsNotificationEmailLogicJson } from '../../formstack/type.notification';

import confirmationEmailJson from './confirmationEmail.json';
import notificationEmailJson from './notificationEmail.json';
import webhookJson from './webhook.json';

const formView = new FormView();

type apiParametersType = {
  apiKey: string | null;
  formId: string | null;
  submissionId?: string | null;
};
// pseudo-global scope
let fieldLogicService: FieldLogicService | null = null;
let formAnalytic: FormAnalytics | null = null;
let formModel: FsFormModel;

const App: React.FC = () => {
  const dispatcher = useContext(UIStateDispatch);
  const uiStateContext = useContext(UIStateContext);
  const [apiParameters, setApiParameters] = useState({
    apiKey: Config.get('apiKey'),
    formId: Config.get('formId'),
    submissionId: Config.get('submissionId'),
  } as apiParametersType);

  const handleFetchSubmissionClick = () => {
    console.log({
      handleFetchSubmissionClick: true,
      apiKey: apiParameters.apiKey,
      submissionId: apiParameters.submissionId,
    });

    chrome.runtime.sendMessage(
      {
        type: 'GetSubmissionFromApiRequest',
        submissionId: apiParameters.submissionId,
        apiKey: apiParameters.apiKey,
      },
      async (apiSubmissionJson) => {
        if (keyIn('data', apiSubmissionJson)) {
          const submissionUiDataItems =
            formModel.getUiPopulateObject(apiSubmissionJson);

          dispatcher(
            actions.submissionSelected.update(uiStateContext, {
              submissionId: apiSubmissionJson.id,
              submissionUiDataItems: submissionUiDataItems,
            })
          );
        } else {
          alert(
            'Failed to get submission data.  See console for more information.' +
              JSON.stringify(apiSubmissionJson || {})
          );
          console.log({
            GetSubmissionFromApiRequest: { error: apiSubmissionJson },
          });
        }

        return true;
      }
    );
  };

  const sendApiRequest = (parameters: apiParametersType) => {
    console.log({ sendApiRequest: { parameters } });
    chrome.runtime.sendMessage(
      {
        type: 'GetFormAsJson',
        fetchFormId: parameters.formId,
        apiKey: parameters.apiKey,
      },
      async (apiFormJson) => {
        if (apiFormJson.status == 'error') {
          console.log({
            errorMessage: 'Error response from API.',
            apiFormJson,
          });
          return;
        }

        await formView.initialize();

        // this has pseudo global scope? defined here but used elsewhere?
        formModel = FsFormModel.fromApiFormJson(
          transformers.formJson(apiFormJson)
        );
        formAnalytic = new FormAnalytics(apiFormJson);
        fieldLogicService = new FieldLogicService(apiFormJson);
        const fieldSummary = fieldLogicService?.getAllFieldSummary();

        // ---------------------------
        if (apiFormJson.id) {
          const notifications = notificationEmailJson.notifications.map(
            (notification) => {
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
          //confirmationEmailJson
          const confirmations = confirmationEmailJson.confirmations.map(
            (confirmation) => {
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
                id: 'CE-' + (emailProps.id || '_NO_NOTIFICATION_EMAIL_ID'),
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

          const webhooks = webhookJson.webhooks.map((webhook) => {
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
                name: fieldSummary[fieldId].label,
                entityType: 'formLogic',
              } as TOffFormLogicEntity;
            });

          dispatcher(
            actions.offFormLogicLists.update(uiStateContext, {
              webhooks: webhooks,
              notificationEmails: notifications,
              confirmationEmails: confirmations,
              formLogic,
            })
          );

          // @ts-ignore - typing issues
          // setNotificationLogics(notifications);
          // ------------------------------
        }

        const formLogicStatusMessages =
          fieldLogicService.getFormLogicStatusMessages();

        const formStatusMessages = formAnalytic.findKnownSetupIssues();

        const fieldIdsWithLogic =
          fieldLogicService?.wrapFieldIdsIntoLabelOptionList(
            fieldLogicService?.getFieldIdsWithLogic()
          );

        const allStatusMessages = [
          ...formStatusMessages,
          ...formLogicStatusMessages,
        ];
        const fieldStatusMessages = allStatusMessages.filter(
          (statusMessage) => statusMessage.fieldId
        );
        ///FieldFewDetailsType

        // UIStateApiResponseFormGetType
        const payload: UIStateApiResponseFormGetType = {
          fieldSummary,
          formStatusMessages,
          formLogicStatusMessages,
          fieldStatusMessages,
          allStatusMessages: [
            ...formStatusMessages,
            ...formLogicStatusMessages,
          ],
          fieldIdsWithLogic,
          formHtml: apiFormJson.html,
          formJson: apiFormJson,
        };
        console.log({ sendApiRequest: { payload } });
        dispatcher(actions.apiResponse.getForm(uiStateContext, payload));
        dispatcher(
          actions.messageFilter.update(uiStateContext, {
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
    );
  };

  useEffect(() => {
    sendApiRequest(apiParameters);
  }, []);

  const handleApiGetFormRequestClick = async () => {
    sendApiRequest(apiParameters);
  };

  const handleApiParameterChange = (apiParameters: apiParametersType) => {
    console.log({ handleApiParameterChange: { apiParameters } });
    setApiParameters(apiParameters);
  };

  const handleSubmissionTextChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const submissionId = evt.target.value;
    setApiParameters({ ...apiParameters, ...{ submissionId } });
  };

  const handleHideFsBuddy = (evt: any) => {
    console.log({ handleHideFsBuddy: { evt } });
    return true;
  };

  return (
    <PrimeReactProvider>
      <div className="ContentContainer">
        <Accordion onTabClose={handleHideFsBuddy} multiple activeIndex={[0]}>
          <AccordionTab header="FS Buddy">
            {/* <p className="m-0"> */}
            <Accordion multiple activeIndex={[5]}>
              <AccordionTab header="API">
                <p className="m-0">
                  <ApiKeyContainer
                    {...apiParameters}
                    onChange={handleApiParameterChange}
                  />
                  <Button onClick={handleApiGetFormRequestClick}>
                    API Request Form{' '}
                  </Button>
                </p>
              </AccordionTab>
              <AccordionTab
                header={`Logic (root field count: ${
                  (uiStateContext.offFormLogic.allOffFormLogic || []).length
                })`}
              >
                <p className="m-0" style={{ paddingLeft: '20px' }}>
                  <LogicFieldSelect />
                  <ExpandedExpressionTreeGraph
                    height={500}
                    width={600}
                    data={
                      uiStateContext.logicFieldSelected.logicalNodeGraphMap ||
                      []
                    }
                  />
                </p>
              </AccordionTab>
              <AccordionTab header="Status Messages">
                <p className="m-0">
                  {uiStateContext.apiResponse.formStatusMessages.length > 0 && (
                    <MessageFilter />
                  )}
                </p>
              </AccordionTab>
              <AccordionTab header="Submissions">
                <p className="m-0">
                  <InputText
                    placeholder="Submission Id"
                    value={apiParameters.submissionId || ''}
                    onChange={handleSubmissionTextChange}
                  />{' '}
                  <br />
                  <Button onClick={handleFetchSubmissionClick}>
                    Load Submission
                  </Button>
                </p>
              </AccordionTab>
              <AccordionTab header="Form View">
                <p className="m-0">
                  <formView.component />
                </p>
              </AccordionTab>
            </Accordion>
            {/* </p> */}
          </AccordionTab>
        </Accordion>
      </div>
    </PrimeReactProvider>
  );
};

export { App };
