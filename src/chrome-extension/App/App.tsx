import React, { useState, useEffect, useContext } from 'react';
import 'primereact/resources/themes/mira/theme.css';
import { actions, UIStateContext, UIStateDispatch } from '../AppState';
import './App.css';
import { filterStatusMessages } from '../../common/functions';

import { FieldLogicService } from '../../FormstackBuddy/FieldLogicService';
import { FormAnalytics } from '../../FormstackBuddy/FormAnalytics';
import { transformers } from '../../formstack/transformers';
import { FormstackBuddy } from '../../FormstackBuddy/FormstackBuddy';
import { MessageFilter } from '../../components/MessageFilter';
import { ApiKeyContainer } from '../pages/Content/ApiKeyContainer';
import { LogicFieldSelect } from '../pages/Content/LogicFieldSelect';
import { PrimeReactProvider } from 'primereact/api';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import ExpandedExpressionTreeGraph from '../../components/ExpandedExpressionTreeGraph/ExpandedExpressionTreeGraph';
import { FormView } from '../pages/Content/FormView/FormView';
import { FsFormModel } from '../../formstack';
import { UIStateApiResponseFormGetType } from '../AppState/types';
import { TUiEvaluationObject } from '../../formstack/classes/Evaluator/type';
const formView = new FormView();
const fetchTreeFormId = '5375703';
const fetchSubmissionId = '1129952515';

// moved this from outside the pages directory and now manifest can't find 128.png ..

let fieldLogicService: FieldLogicService | null = null;
let formAnalytic: FormAnalytics | null = null;
let currentFieldCollection: FsFormModel;

type apiParametersType = {
  apiKey: string | null;
  formId: string | null;
};

const App: React.FC = () => {
  const dispatcher = useContext(UIStateDispatch);
  const uiStateContext = useContext(UIStateContext);

  const [apiParameters, setApiParameters] = useState({
    apiKey: 'cc17435f8800943cc1abd3063a8fe44f',
    formId: '5375703',
  } as apiParametersType);

  const handleFetchSubmissionClick = () => {
    console.log({
      handleFetchSubmissionClick: true,
      apiKey: apiParameters.apiKey,
      submissionId: fetchSubmissionId,
    });

    chrome.runtime.sendMessage(
      {
        type: 'GetSubmissionFromApiRequest',
        submissionId: fetchSubmissionId,
        apiKey: apiParameters.apiKey,
      },
      async (apiSubmissionJson) => {
        const submissionUiDataItems =
          currentFieldCollection.getUiPopulateObject(apiSubmissionJson);

        dispatcher(
          actions.submissionSelected.update(uiStateContext, {
            submissionId: apiSubmissionJson.id,
            submissionUiDataItems: submissionUiDataItems,
          })
        );
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
        currentFieldCollection = FsFormModel.fromApiFormJson(
          transformers.formJson(apiFormJson)
        );

        formAnalytic =
          FormstackBuddy.getInstance().getFormAnalyticService(apiFormJson);

        fieldLogicService = FormstackBuddy.getInstance().getFieldLogicService(
          transformers.formJson(apiFormJson)
        );

        const fieldSummary = fieldLogicService?.getAllFieldSummary();

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

  const handleClearFsHidden = () => {
    formView.clearFsHidden();
  };

  const handleLogicFieldSelected = (fieldId: string) => {
    console.log('handleLogicFieldSelected');
    const statusMessages = fieldLogicService?.getStatusMessagesFieldId(fieldId);
    fieldLogicService?.getCircularReferenceFieldIds(fieldId);
    const logicalNodeGraphMap =
      fieldLogicService?.getLogicNodeGraphMap(fieldId);

    const allFieldSummary = fieldLogicService?.getAllFieldSummary();
    dispatcher(
      actions.logic.updateSelectedField(uiStateContext, {
        logicalNodeGraphMap,
        fieldId,
        statusMessages,
        allFieldSummary,
      })
    );
  };

  const handleClearAllStatusMessage = async () => {
    console.log('handleClearAllStatusMessage');
    const message = {
      messageType: 'clearAllStatusMessages',
      payload: null,
    };

    // @ts-ignore
    document
      .getElementById(FormView.IFRAME_ID)
      // @ts-ignore
      .contentWindow.postMessage(message);
  };

  const handleApiGetFormRequestClick = async () => {
    sendApiRequest(apiParameters);
  };

  const handleApiParameterChange = (apiParameters: apiParametersType) => {
    console.log({ handleApiParameterChange: { apiParameters } });
    setApiParameters(apiParameters);
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
            <p className="m-0">
              <Accordion multiple activeIndex={[0, 2, 4]}>
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
                    (uiStateContext.apiResponse.fieldIdsWithLogic || []).length
                  })`}
                >
                  <p className="m-0">
                    <LogicFieldSelect
                      options={
                        uiStateContext.apiResponse.fieldIdsWithLogic || []
                      }
                      onFieldIdSelected={handleLogicFieldSelected}
                    />
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
                    <Button onClick={handleClearAllStatusMessage}>
                      Clear All Status Messages
                    </Button>
                    <Button
                      style={{ marginLeft: '10px' }}
                      onClick={handleClearFsHidden}
                    >
                      Clear fsHidden
                    </Button>

                    <div style={{ maxWidth: '500px', paddingTop: 20 }}>
                      {uiStateContext.apiResponse.formStatusMessages.length >
                        0 && <MessageFilter />}
                    </div>
                  </p>
                </AccordionTab>
                <AccordionTab header="Submissions">
                  <p className="m-0">
                    <Button onClick={handleFetchSubmissionClick}>
                      Fetch Submission (id:1129952515)
                    </Button>
                  </p>
                </AccordionTab>
                <AccordionTab header="Form View">
                  <p className="m-0">
                    {uiStateContext.apiResponse.formHtml !== '' && (
                      <formView.component />
                    )}{' '}
                  </p>
                </AccordionTab>
              </Accordion>
            </p>
          </AccordionTab>
        </Accordion>
      </div>
    </PrimeReactProvider>
  );
};

export { App };
