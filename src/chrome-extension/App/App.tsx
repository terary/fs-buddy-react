import React, { useState, useEffect, useContext } from 'react';
import 'primereact/resources/themes/mira/theme.css';
import { actions, UIStateContext, UIStateDispatch } from '../AppState';
import './App.css';
import { filterStatusMessages, keyIn } from '../../common/functions';

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
import { InputText } from 'primereact/inputtext';

const formView = new FormView();

// moved this from outside the pages directory and now manifest can't find 128.png ..

let fieldLogicService: FieldLogicService | null = null;
let formAnalytic: FormAnalytics | null = null;
let currentFieldCollection: FsFormModel;

import { Config } from '../../config';

type apiParametersType = {
  apiKey: string | null;
  formId: string | null;
  submissionId?: string | null;
};

// Not loading debug (field definitions) as expected see formId 5568576

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
    // const handleClearAllStatusMessage = async () => {
    //   const message = {
    //     messageType: 'clearAllStatusMessages',
    //     payload: null,
    //   };

    //   // @ts-ignore
    //   document
    //     .getElementById(FormView.IFRAME_ID)
    //     // @ts-ignore
    //     .contentWindow.postMessage(message);
    // };
    // build this into GetSubmissionFromApiRequest

    chrome.runtime.sendMessage(
      {
        type: 'GetSubmissionFromApiRequest',
        submissionId: apiParameters.submissionId,
        apiKey: apiParameters.apiKey,
      },
      async (apiSubmissionJson) => {
        if (keyIn('data', apiSubmissionJson)) {
          const submissionUiDataItems =
            currentFieldCollection.getUiPopulateObject(apiSubmissionJson);

          dispatcher(
            actions.submissionSelected.update(uiStateContext, {
              submissionId: apiSubmissionJson.id,
              submissionUiDataItems: submissionUiDataItems,
            })
          );
        } else {
          alert(
            'Failed to get submission data.  See console for more information.  ' +
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
        <Accordion onTabClose={handleHideFsBuddy} multiple activeIndex={[]}>
          <AccordionTab header="FS Buddy">
            {/* <p className="m-0"> */}
            <Accordion multiple activeIndex={[]}>
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
                <p className="m-0" style={{ paddingLeft: '20px' }}>
                  <LogicFieldSelect
                    options={uiStateContext.apiResponse.fieldIdsWithLogic || []}
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

                  {/* {uiStateContext.apiResponse.formHtml !== '' && (
                    <formView.component />
                  )}{' '} */}
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
