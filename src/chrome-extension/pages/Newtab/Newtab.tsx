import React, { useState, useEffect } from 'react';
// import logo from '../../assets/img/logo.svg';
import './Newtab.css';
// import './Newtab.scss';
import { TStatusRecord } from '../../../components/StatusMessageListContainer/type';
import { FormView } from '../Content/FormView/FormView';
import { FsFormModel } from '../../../formstack';
import { FieldLogicService } from '../../../FormstackBuddy/FieldLogicService';
import { FormAnalytics } from '../../../FormstackBuddy/FormAnalytics';
import { transformers } from '../../../formstack/transformers';
import { FormstackBuddy } from '../../../FormstackBuddy/FormstackBuddy';
import { MessageFilter } from '../../../components/MessageFilter';
import { ApiKeyContainer } from '../Content/ApiKeyContainer';
import { LogicFieldSelect } from '../Content/LogicFieldSelect';

const formView = new FormView();
const fetchTreeFormId = '5375703';
const fetchSubmissionId = '1129952515';

let fieldLogicService: FieldLogicService | null = null;
let formAnalytic: FormAnalytics | null = null;
let currentFieldCollection: FsFormModel;

const Newtab = () => {
  const [formHtml, setFormHtml] = useState('No Form HTML found.');

  const [fieldStatusPayload, setFieldStatusPayload] = useState(
    null as null | {
      fieldIdsWithLogic: [];
      formStatusMessages: TStatusRecord[];
      formHtml: null; // 'No Form HTML found';
    }
  );

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

    const message = {
      messageType: 'getFieldLogicDependentsResponse',
      payload,
    };

    // @ts-ignore
    document.getElementById('theFrame').contentWindow.postMessage(message);
  };

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
        const message = {
          messageType: 'fetchSubmissionResponse',
          payload: {
            id: apiSubmissionJson.id,
            submissionData: submissionUiDataItems,
          },
        };
        // @ts-ignore
        document.getElementById('theFrame').contentWindow.postMessage(message);
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

  const handleClearFsHidden = () => {
    formView.clearFsHidden();
  };

  const handleWorkWithLogic = async () => {
    console.log('handleWorkWithLogic');
  };

  const handleClearAllStatusMessage = async () => {
    console.log('handleClearAllStatusMessage');
    const message = {
      messageType: 'clearAllStatusMessages',
      payload: null,
    };

    // @ts-ignore
    document.getElementById('theFrame').contentWindow.postMessage(message);
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
          formHtml: apiFormJson.html,
        };
        // -----------------

        //const payload = { formAnalytic, fieldLogicService };
        // @ts-ignore payload wrong shape (need gto work-out typing)
        payload && setFieldStatusPayload(payload);
        setFormHtml(apiFormJson.html);
        const fieldMessages = payload.formStatusMessages.filter(
          (statusMessage) => statusMessage.fieldId
        );
        formView.applyFieldStatusMessages(fieldMessages);

        console.log({
          useEffect: true,
          payload,
        });
      }
    );
  }, []);

  return (
    <div className="App">
      <header className="App-headerx">
        <button onClick={handleClearAllStatusMessage}>
          Clear All Status Messages
        </button>
        <br />
        <button onClick={handleWorkWithLogic}>Work With Logic</button>
        <br />
        <button onClick={handleClearFsHidden}>Clear fsHidden</button>
        <button onClick={handleFetchSubmissionClick}>
          Fetch Submission (id:1129952515)
        </button>

        <LogicFieldSelect
          options={fieldStatusPayload?.fieldIdsWithLogic || []}
          onFieldIdSelected={handleLogicFieldSelected}
        />
        <ApiKeyContainer title="The Title" />
        <table>
          <tbody>
            <tr>
              <td>
                <div style={{ textAlign: 'left', maxWidth: '400px' }}>
                  {fieldStatusPayload?.formStatusMessages && (
                    <MessageFilter
                      statusMessages={fieldStatusPayload?.formStatusMessages}
                    />
                  )}
                </div>
              </td>
              <td>
                <div style={{ textAlign: 'left', maxWidth: '400px' }}>
                  form view (not available from "newtab"):
                  {/* {fieldStatusPayload?.formHtml && (
                    <formView.component
                      formHtml={fieldStatusPayload.formHtml}
                    />
                  )} */}
                  {/* {fieldStatusPayload?.formHtml} */}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p>
          Edit <code>src/pages/Newtab/Newtab.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
        <h6>The color of this paragraph is defined using SASS.</h6>
      </header>
    </div>
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

export default Newtab;
