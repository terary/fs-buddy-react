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

import { PrimeReactProvider } from 'primereact/api';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
// import 'primereact/resources/themes/lara-light-cyan/theme.css';
// import 'primereact/resources/themes/vela-blue/theme.css';
// import 'primereact/resources/themes/md-light-indigo/theme.css';
import 'primereact/resources/themes/md-light-deeppurple/theme.css';

let fieldLogicService: FieldLogicService | null = null;
let formAnalytic: FormAnalytics | null = null;
let currentFieldCollection: FsFormModel;
const formView = new FormView();

const fetchTreeFormId = '5375703';
// const fetchTreeFormId = '5358471'; // has submissions
// const fetchSubmissionId = '1129952515';
const fetchSubmissionId = '1172665940'; // from formId: '5375703', only a couple fields populated

// 1129952515 submission id

import 'primereact/resources/themes/md-light-deeppurple/theme.css';
import { App } from '../../App';

const ContentScript: React.FC = () => {
  return <App />;
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
