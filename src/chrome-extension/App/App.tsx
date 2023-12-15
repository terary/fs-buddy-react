import React, { useState, useEffect } from 'react';
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
import 'primereact/resources/themes/md-light-deeppurple/theme.css';
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
const App: React.FC = () => {
  const [formHtml, setFormHtml] = useState('No Form HTML found.');
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
    const apiKey = getApiKey();
    console.log({
      handleFetchSubmissionClick: true,
      apiKey,
      submissionId: fetchSubmissionId,
    });

    chrome.runtime.sendMessage(
      {
        type: 'GetSubmissionFromApiRequest',
        submissionId: fetchSubmissionId,
        apiKey,
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

  useEffect(() => {
    // const fetchTreeFormId = '5079339';
    // const fetchTreeFormId = '5375703';

    const apiKey = getApiKey();

    chrome.runtime.sendMessage(
      {
        type: 'GetFormAsJson',
        fetchFormId: fetchTreeFormId,
        apiKey,
        // apiKey: "cc17435f8800943cc1abd3063a8fe44f",
      },
      async (apiFormJson) => {
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
  }, []);

  const handleClearFsHidden = () => {
    formView.clearFsHidden();
  };

  const handleLogicFieldSelected = (fieldId: string) => {
    console.log('handleLogicFieldSelected');
    // const payload = { fieldId };
    // console.log({ payload });
    const fieldIds = fieldLogicService?.getFieldIdsExtendedLogicOf(fieldId);
    const statusMessages = fieldLogicService?.getStatusMessagesFieldId(fieldId);
    const interdependentFieldIds =
      fieldLogicService?.getCircularReferenceFieldIds(fieldId);
    const logicalNodeGraphMap =
      fieldLogicService?.getLogicNodeGraphMap(fieldId);

    const payload = {
      dependentsByFieldId: {
        [fieldId]: {
          statusMessages: statusMessages,
          dependentFieldIds: fieldIds,
          interdependentFieldIds: interdependentFieldIds,
        },
      },
      logicalNodeGraphMap,
    };
    const allFieldIds = fieldLogicService?.getFieldIdsAll() || [];
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

  const handleWorkWithLogic = async () => {
    console.log('handleWorkWithLogic');
    // const message = {
    //   messageType: 'clearAllStatusMessages',
    //   payload: null,
    // };

    // // @ts-ignore
    // document.getElementById('theFrame').contentWindow.postMessage(message);
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
    formView.applyFieldStatusMessages(
      fieldStatusPayload?.fieldStatusMessages || []
    );
    console.log({
      applyFieldStatusMessages: fieldStatusPayload?.fieldStatusMessages || [],
    });
  };

  const [activeIndex, setActiveIndex] = useState([0]);
  return (
    <PrimeReactProvider>
      <div className="ContentContainer">
        <h2 style={{ textAlign: 'center' }}>FsBuddy</h2>
        <Button onClick={handleClearFsHidden}>Clear fsHidden</Button>

        <Accordion multiple activeIndex={[0, 4]}>
          <AccordionTab header="API">
            <p className="m-0">
              <h4>API</h4>
              <ApiKeyContainer title="The Title" />
              <Button onClick={handleApiGetFormRequestClick}>
                API Request Form{' '}
              </Button>
            </p>
          </AccordionTab>
          <AccordionTab header="Logic">
            <p className="m-0">
              <h4>
                Logic (root field count:{' '}
                {(fieldStatusPayload?.fieldIdsWithLogic || []).length}){' '}
              </h4>
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

              <div style={{ maxWidth: '500px' }}>
                {fieldStatusPayload?.formStatusMessages && (
                  <MessageFilter
                    onFiltered={handleOnFilteredStatusMessages}
                    statusMessages={fieldStatusPayload?.formStatusMessages}
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
                  statusMessage={fieldStatusPayload.fieldStatusMessages || []}
                  formHtml={formHtml}
                />
              )}{' '}
            </p>
          </AccordionTab>
        </Accordion>
      </div>
    </PrimeReactProvider>
  );
};

function getApiKey() {
  const apiKey = 'cc17435f8800943cc1abd3063a8fe44f';
  // const apiKey = passwordControl.value;
  if (apiKey.length != 32) {
    alert('API Key does not look correct. Aborting Get Form');
    return;
  }
  return apiKey;
}

export { App };
