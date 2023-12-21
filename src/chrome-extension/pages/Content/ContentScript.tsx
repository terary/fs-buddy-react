import React, { useEffect, useState } from 'react';
import { FsFormModel, TFsFieldAnyJson } from '../../../formstack';
import { FieldLogicService } from '../../../FormstackBuddy/FieldLogicService';
import { FormAnalytics } from '../../../FormstackBuddy/FormAnalytics';
import { FormView } from './FormView/FormView';
import './ContentScript.css';
import { App } from '../../App';

let fieldLogicService: FieldLogicService | null = null;
let formAnalytic: FormAnalytics | null = null;
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
