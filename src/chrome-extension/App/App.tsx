import React, { useState, useEffect } from 'react';
import 'primereact/resources/themes/mira/theme.css';

import './App.css';
import { TStatusRecord } from '../../components/StatusMessageListContainer/type';
// import { FsFormModel } from '../../../../formstack';

import { FieldLogicService } from '../../FormstackBuddy/FieldLogicService';
import { FormAnalytics } from '../../FormstackBuddy/FormAnalytics';
import { transformers } from '../../formstack/transformers';
import { FormstackBuddy } from '../../FormstackBuddy/FormstackBuddy';
import { MessageFilter } from '../../components/MessageFilter';
import { ApiKeyContainer } from '../pages/Content/ApiKeyContainer';
import { LogicFieldSelect } from '../pages/Content/LogicFieldSelect';
import { TGraphNode } from '../../formstack/transformers/pojoToD3TableData';
import { PrimeReactProvider } from 'primereact/api';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import ExpandedExpressionTreeGraph from '../../components/ExpandedExpressionTreeGraph/ExpandedExpressionTreeGraph';
import { FormView } from '../pages/Content/FormView/FormView';
import { FsFormModel } from '../../formstack';
const formView = new FormView();
const fetchTreeFormId = '5375703';
const fetchSubmissionId = '1129952515';

// moved this from outside the pages directory and now manifest can't find 128.png ..

let fieldLogicService: FieldLogicService | null = null;
let formAnalytic: FormAnalytics | null = null;
let currentFieldCollection: FsFormModel;
// interface Props {
//   title: string;
// }
type apiParametersType = {
  apiKey: string | null;
  formId: string | null;
};

const App: React.FC = () => {
  const [formHtml, setFormHtml] = useState('No Form HTML found.');
  const [apiParameters, setApiParameters] = useState({
    apiKey: 'cc17435f8800943cc1abd3063a8fe44f',
    formId: '5375703',
  } as apiParametersType);

  const [currentLogicFieldGraphMap, setCurrentLogicFieldGraphMap] = useState(
    [] as TGraphNode[]
  );
  const [fieldStatusPayload, setFieldStatusPayload] = useState(
    null as null | {
      fieldIdsWithLogic: [];
      formStatusMessages: TStatusRecord[];
      fieldStatusMessages: TStatusRecord[];
    }
  );

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
        // apiKey: "cc17435f8800943cc1abd3063a8fe44f",
      },
      async (apiSubmissionJson) => {
        console.log({ apiSubmissionJson });
        const submissionUiDataItems =
          currentFieldCollection.getUiPopulateObject(apiSubmissionJson);
        // const message = {
        //   messageType: 'fetchSubmissionResponse',
        //   payload: {
        //     id: apiSubmissionJson.id,
        //     submissionData: submissionUiDataItems,
        //     allFieldSummary,
        //   },
        // };

        // formView.applySubmissionDataStatusMessages(message);
        formView.applySubmissionDataStatusMessages(
          apiSubmissionJson.id,
          submissionUiDataItems
        );
        // @ts-ignore
        // document.getElementById('theFrame').contentWindow.postMessage(message);
        // caller.postMessage({
        //   messageType: 'fetchSubmissionResponse',
        //   payload: {
        //     id: apiSubmissionJson.id,
        //     submissionData: submissionUiDataItems,
        //   },
        // });
        return true;
      }
    );
  };

  const sendApiRequest = (parameters: apiParametersType) => {
    //   const apiKey = 'cc17435f8800943cc1abd3063a8fe44f';
    console.log({ sendApiRequest: { parameters } });
    chrome.runtime.sendMessage(
      {
        type: 'GetFormAsJson',
        fetchFormId: parameters.formId,
        apiKey: parameters.apiKey,
        // apiKey: "cc17435f8800943cc1abd3063a8fe44f",
      },
      async (apiFormJson) => {
        if (apiFormJson.status == 'error') {
          console.log({
            errorMessage: 'Error response from API.',
            apiFormJson,
          });
          return;
        }

        console.log({ sendApiRequestResponse: { apiFormJson } });
        await formView.initialize();
        currentFieldCollection = FsFormModel.fromApiFormJson(
          transformers.formJson(apiFormJson)
        );

        formAnalytic =
          FormstackBuddy.getInstance().getFormAnalyticService(apiFormJson);

        fieldLogicService = FormstackBuddy.getInstance().getFieldLogicService(
          transformers.formJson(apiFormJson)
        );
        // -----------------
        const fieldSummary = fieldLogicService?.getAllFieldSummary();
        // formView.setAllFieldSummary(fieldSummary);
        const formLogicStatusMessages =
          fieldLogicService.getFormLogicStatusMessages();
        const formStatusMessages = formAnalytic.findKnownSetupIssues();
        const fieldIdsWithLogic =
          fieldLogicService?.wrapFieldIdsIntoLabelOptionList(
            fieldLogicService?.getFieldIdsWithLogic()
          );
        const payload = {
          fieldSummary,
          formStatusMessages: [
            ...formStatusMessages,
            ...formLogicStatusMessages,
          ],
          fieldIdsWithLogic,
          fieldStatusMessages: [] as TStatusRecord[],
        };
        // -----------------
        const fieldMessages = payload.formStatusMessages.filter(
          (statusMessage) => statusMessage.fieldId
        );
        payload.fieldStatusMessages = fieldMessages;
        // formView.applyFieldStatusMessages(fieldMessages);
        //const payload = { formAnalytic, fieldLogicService };
        // @ts-ignore payload wrong shape (need gto work-out typing)
        payload && setFieldStatusPayload(payload);

        setFormHtml(apiFormJson.html);
        // formView.applyFieldStatusMessages(fieldMessages);

        console.log({
          useEffect: true,
          payload,
        });
      }
    );
  };

  useEffect(() => {
    // const fetchTreeFormId = '5079339';
    // const fetchTreeFormId = '5375703';
    sendApiRequest(apiParameters);
  }, []);

  const handleClearFsHidden = () => {
    formView.clearFsHidden();
  };

  const handleLogicFieldSelected = (fieldId: string) => {
    console.log('handleLogicFieldSelected');
    // const payload = { fieldId };
    // console.log({ payload });
    const statusMessages = fieldLogicService?.getStatusMessagesFieldId(fieldId);
    fieldLogicService?.getCircularReferenceFieldIds(fieldId);
    const logicalNodeGraphMap =
      fieldLogicService?.getLogicNodeGraphMap(fieldId);

    // Want to be able to filter these ? or create/add a differnt filter component?

    const allFieldSummary = fieldLogicService?.getAllFieldSummary();
    formView.applyLogicStatusMessages(
      fieldId,
      statusMessages || [],
      allFieldSummary
    );
    setCurrentLogicFieldGraphMap(logicalNodeGraphMap || []);
    console.log({
      applyFieldStatusMessages: fieldStatusPayload?.fieldStatusMessages || [],
    });
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

  const handleOnFilteredStatusMessages = (
    filteredStatusMessage: TStatusRecord[]
  ): void => {
    console.log({ filteredStatusMessage });
    formView.applyFieldStatusMessages(filteredStatusMessage || []);
  };

  const handleApiGetFormRequestClick = async () => {
    sendApiRequest(apiParameters);
  };

  const handleApiParameterChange = (apiParameters: apiParametersType) => {
    console.log({ handleApiParameterChange: { apiParameters } });
    setApiParameters(apiParameters);
  };

  return (
    <PrimeReactProvider>
      <div className="ContentContainer">
        <Accordion multiple activeIndex={[0]}>
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
                    (fieldStatusPayload?.fieldIdsWithLogic || []).length
                  })`}
                >
                  <p className="m-0">
                    <LogicFieldSelect
                      options={fieldStatusPayload?.fieldIdsWithLogic || []}
                      onFieldIdSelected={handleLogicFieldSelected}
                    />
                    <ExpandedExpressionTreeGraph
                      height={500}
                      width={600}
                      data={currentLogicFieldGraphMap}
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
                      {fieldStatusPayload?.formStatusMessages && (
                        <MessageFilter
                          onFiltered={handleOnFilteredStatusMessages}
                          statusMessages={
                            fieldStatusPayload?.formStatusMessages
                          }
                        />
                      )}
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
                    {fieldStatusPayload?.fieldStatusMessages && (
                      <formView.component
                        statusMessage={
                          fieldStatusPayload.fieldStatusMessages || []
                        }
                        formHtml={formHtml}
                      />
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
