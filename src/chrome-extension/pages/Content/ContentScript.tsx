import React, { useEffect, useState } from 'react';
import { ApiKeyContainer } from './ApiKeyContainer';
import { LogicFieldSelect } from './LogicFieldSelect';
import { FormstackBuddy } from '../../../FormstackBuddy/FormstackBuddy';
import { FsFormModel, TFsFieldAnyJson } from '../../../formstack';
import { FieldLogicService } from '../../../FormstackBuddy/FieldLogicService';
import { transformers } from '../../../formstack/transformers';

import { FormAnalytics } from '../../../FormstackBuddy/FormAnalytics';
import { StatusMessageContainer } from '../../containers/StatusMessages';
import { TStatusRecord } from '../../../formstack/classes/Evaluator/type';
import { FormView } from './FormView/FormView';
import { CheckboxArray } from '../../common/CheckboxArray';
import { MessageFilter } from '../../../components/MessageFilter';
import './ContentScript.css';
import ExpandedExpressionTreeGraph from '../../../components/ExpandedExpressionTreeGraph/ExpandedExpressionTreeGraph';
import { TGraphNode } from '../../../formstack/transformers/pojoToD3TableData';

let fieldLogicService: FieldLogicService | null = null;
let formAnalytic: FormAnalytics | null = null;
let currentFieldCollection: FsFormModel;
const formView = new FormView();

const fetchTreeFormId = '5375703';
// const fetchTreeFormId = '5358471'; // has submissions
// const fetchSubmissionId = '1129952515';
const fetchSubmissionId = '1172665940'; // from formId: '5375703', only a couple fields populated

// 1129952515 submission id

interface Props {
  title: string;
}

const ContentScript: React.FC<Props> = ({ title }: Props) => {
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
    document.getElementById('theFrame').contentWindow.postMessage(message);
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

  return (
    <div className="ContentContainer">
      <h2 style={{ textAlign: 'center' }}>{title} Page</h2>
      <table>
        <tbody>
          <tr>
            <td colSpan={2}>
              {' '}
              <ApiKeyContainer title="The Title" />
            </td>
          </tr>

          <tr>
            <td>
              <button onClick={handleApiGetFormRequestClick}>
                API Request Form{' '}
              </button>
            </td>
            <td>
              <button onClick={handleClearAllStatusMessage}>
                Clear All Status Messages
              </button>
            </td>
          </tr>

          <tr>
            <td>
              <button onClick={handleWorkWithLogic}>Work With Logic</button>
            </td>
            <td>
              <button onClick={handleClearFsHidden}>Clear fsHidden</button>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <button onClick={handleFetchSubmissionClick}>
                Fetch Submission (id:1129952515)
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <LogicFieldSelect
        options={fieldStatusPayload?.fieldIdsWithLogic || []}
        onFieldIdSelected={handleLogicFieldSelected}
      />
      <ExpandedExpressionTreeGraph
        height={500}
        width={600}
        data={currentLogicFieldGraphMap}
      />
      <div style={{ maxWidth: '500px' }}>
        {fieldStatusPayload?.formStatusMessages && (
          <MessageFilter
            onFiltered={handleOnFilteredStatusMessages}
            statusMessages={fieldStatusPayload?.formStatusMessages}
          />
        )}
      </div>
      {/* <StatusMessageContainer
        statusMessages={fieldStatusPayload?.formStatusMessages || []}
      /> */}
      {fieldStatusPayload?.fieldStatusMessages && (
        <formView.component
          statusMessage={fieldStatusPayload.fieldStatusMessages || []}
          formHtml={formHtml}
        />
      )}
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

function getChildFrameHtml() {
  const url = chrome.runtime.getURL('form-render-inject.html');

  return fetch(url).then((response) => {
    return response.text();
  });
}

function buildIframe(iframeId: string): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.id = iframeId;
  iframe.style.width = '50%';
  iframe.style.height = '100%';
  iframe.style.zIndex = '1001';
  iframe.style.top = '50px';
  iframe.style.right = '0px';
  iframe.style.position = 'absolute';
  iframe.style.backgroundColor = 'green';
  return iframe;
}
function getAllFieldInfoRequest() {
  /// getFieldIdsExtendedLogicOf
  if (fieldLogicService === null) {
    console.log(
      'handleGetAllFieldInfoRequest failed.  "fieldLogicService" not defined.'
    );
    return;
  }
  if (formAnalytic === null) {
    console.log(
      'handleGetAllFieldInfoRequest failed.  "formAnalytic" not defined.'
    );
    return;
  }

  const fieldSummary = fieldLogicService?.getAllFieldSummary();
  const formLogicStatusMessages =
    fieldLogicService.getFormLogicStatusMessages();
  const formStatusMessages = formAnalytic.findKnownSetupIssues();
  const fieldIdsWithLogic = fieldLogicService?.wrapFieldIdsIntoLabelOptionList(
    fieldLogicService?.getFieldIdsWithLogic()
  );
  return {
    fieldSummary,
    formStatusMessages: [...formStatusMessages, ...formLogicStatusMessages],
    fieldIdsWithLogic,
  };
}

function handleGetAllFieldInfoRequest(
  caller: MessageEventSource,
  payload: any
) {
  /// getFieldIdsExtendedLogicOf
  if (fieldLogicService === null) {
    console.log(
      'handleGetAllFieldInfoRequest failed.  "fieldLogicService" not defined.'
    );
    return;
  }
  if (formAnalytic === null) {
    console.log(
      'handleGetAllFieldInfoRequest failed.  "formAnalytic" not defined.'
    );
    return;
  }

  const fieldSummary = fieldLogicService?.getAllFieldSummary();
  const formLogicStatusMessages =
    fieldLogicService.getFormLogicStatusMessages();
  const formStatusMessages = formAnalytic.findKnownSetupIssues();
  const fieldIdsWithLogic = fieldLogicService?.wrapFieldIdsIntoLabelOptionList(
    fieldLogicService?.getFieldIdsWithLogic()
  );

  caller.postMessage({
    messageType: 'getAllFieldInfoResponse',
    payload: {
      fieldSummary,
      formStatusMessages: [...formStatusMessages, ...formLogicStatusMessages],
      fieldIdsWithLogic,
    },
  });
}

function removeFormHtml() {
  const theIFrame = document.getElementById('theFrame');
  if (theIFrame) {
    theIFrame.remove();
  }
}

window.onmessage = function (e) {
  switch (e.data.messageType) {
    // case "getFieldLogicDependentsRequest":
    //   e.source &&
    //     handleGetFieldLogicDependentsRequest(e.source, e.data.payload);
    //   !e.source && console.log("No Source of message received.");
    //   break;
    case 'getAllFieldInfoRequest':
      e.source && handleGetAllFieldInfoRequest(e.source, e.data.payload);
      !e.source && console.log('No Source of message received.');
      break;
    case 'removeFsBuddyRequest':
      removeFormHtml();
      break;
    // case "fetchSubmissionRequest":
    //   console.log("receive message fetch submission");
    //   console.log({ payload: e.data.payload });

    //   e.source && handleFetchSubmissionRequest(e.source, e.data.payload);
    //   break;
    default:
    // console.log(`message type not understood. ( '${e.data.messageType}')`);
  }
};

function getFormAsJson() {
  // removeFormHtml();
  // const fetchTreeFormId = getFormIdFromLocation();
  // const fetchTreeFormId = '5079339';

  const apiKey = getApiKey();
  if (fetchTreeFormId && apiKey) {
    chrome.runtime.sendMessage(
      {
        type: 'GetFormAsJson',
        fetchFormId: fetchTreeFormId,
        apiKey,
        // apiKey: "cc17435f8800943cc1abd3063a8fe44f",
      },
      async (apiFormJson) => {
        const childFrameHtml = await getChildFrameHtml().catch((e) => {
          console.log('Failed to get API');
          console.log({ e });
        });
        // const iframe = buildIframe('theFrame');
        // iframe.srcdoc = childFrameHtml + apiFormJson.html;
        // const theBody = document.querySelector('body');
        // theBody?.prepend(iframe);

        if (!apiFormJson.id) {
          // if there is no formId, then we probably didn't get real 200
          throw new Error(
            'Unrecognized response' + JSON.stringify(apiFormJson)
          );
        }

        // currentFieldCollection = FsFormModel.fromApiFormJson(
        //   transformers.formJson(apiFormJson)
        // );

        formAnalytic =
          FormstackBuddy.getInstance().getFormAnalyticService(apiFormJson);

        fieldLogicService = FormstackBuddy.getInstance().getFieldLogicService(
          transformers.formJson(apiFormJson)
        );
      }
    );
  } else {
    console.log('Failed to fetchTree, could not get formId from url');
  }
}

getFormAsJson();
export default ContentScript;
