import React from 'react';
import {
  FsFormModel,
  FieldLogicService,
  FormAnalyticService,
} from '../../../formstack';
import { FormView } from './FormView/FormView';
import './ContentScript.css';
import { App } from '../../App';

// *tmc* these shouldn't be used any more?  They should be in AppController ?
let fieldLogicService: FieldLogicService | null = null;
let formAnalytic: FormAnalyticService | null = null;
let currentFieldCollection: FsFormModel;
const formView = new FormView();

const fetchTreeFormId = '5375703';
// const fetchTreeFormId = '5358471'; // has submissions
// const fetchSubmissionId = '1129952515';
const fetchSubmissionId = '1172665940'; // from formId: '5375703', only a couple fields populated
// 1129952515 submission id

const ContentScript: React.FC = () => {
  return (
    <div style={{ border: '1px solid black' }}>
      <App />
    </div>
  );
};

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

window.onmessage = function (e) {
  switch (e.data.messageType) {
    case 'getAllFieldInfoRequest':
      e.source && handleGetAllFieldInfoRequest(e.source, e.data.payload);
      !e.source && console.log('No Source of message received.');
      break;
    default:
    // console.log(`message type not understood. ( '${e.data.messageType}')`);
  }
};
export default ContentScript;
