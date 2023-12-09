import React, { ReactElement, useEffect, useState } from 'react';
// import { ApiKeyContainer } from './ApiKeyContainer';
// import { LogicFieldSelect } from './LogicFieldSelect';
// import { FormstackBuddy } from '../../../FormstackBuddy/FormstackBuddy';
import { FsFormModel, TFsFieldAnyJson } from '../../../../formstack';
import { FieldLogicService } from '../../../../FormstackBuddy/FieldLogicService';
// import { transformers } from '../../../formstack/transformers';

import { FormAnalytics } from '../../../../FormstackBuddy/FormAnalytics';
// import { StatusMessageContainer } from '../../containers/StatusMessages';
import { TStatusRecord } from '../../../../formstack/classes/Evaluator/type';
import { TApiForm } from '../../../common/type.form';

let fieldLogicService: FieldLogicService | null = null;
let formAnalytic: FormAnalytics | null = null;
let currentFieldCollection: FsFormModel;

const fetchTreeFormId = '5375703';
// const fetchTreeFormId = '5358471'; // has submissions
const fetchSubmissionId = '1129952515';
// 1129952515 submission id
// TApiFormJson
interface Props {
  formHtml?: string;
  context?: any;
  statusMessage: TStatusRecord[];
}
class FormView {
  _helperHtml!: string;

  async initialize(): Promise<void> {
    try {
      this._helperHtml = await getChildFrameHtml();
    } catch (e) {
      console.log({
        message: 'failed to get form iframe html',
        e,
      });
    }
    // addEventListener[Symbol]('announceAwake');
    window.onmessage = function (e) {
      switch (e.data.messageType) {
        // case "getFieldLogicDependentsRequest":
        //   e.source &&
        //     handleGetFieldLogicDependentsRequest(e.source, e.data.payload);
        //   !e.source && console.log("No Source of message received.");
        //   break;
        case 'announceAwake':
          console.log({ announceAwake: 'received' });
          break;
        // case 'removeFsBuddyRequest':
        //   removeFormHtml();
        //   break;
        // case "fetchSubmissionRequest":
        //   console.log("receive message fetch submission");
        //   console.log({ payload: e.data.payload });

        //   e.source && handleFetchSubmissionRequest(e.source, e.data.payload);
        //   break;
        default:
        // console.log(`message type not understood. ( '${e.data.messageType}')`);
      }
    };
  }
  // const FormView: React.FC<Props> = ({ formHtml }: Props) => {
  // const [fieldStatusPayload, setFieldStatusPayload] = useState(
  //   null as null | {
  //     fieldIdsWithLogic: [];
  //     formStatusMessages: TStatusRecord[];
  //   }
  // );

  // useEffect(() => {
  //   // const fetchTreeFormId = '5079339';
  //   // const fetchTreeFormId = '5375703';
  // }, []);

  // const component: React.FC<Props> = ({ formHtml }: Props) => {
  _removeAllCssName(cssClassName: string): void {
    const iframe = document.getElementById('theFrame2');
    const x = iframe ? document.querySelectorAll(`.${cssClassName}`) : [];
    console.log({
      cssClassName,
      foundElements: x.length,
    });
    iframe &&
      iframe.querySelectorAll(`.${cssClassName}`).forEach((el) => {
        el.classList.remove(cssClassName);
      });

    !iframe && console.log('No Iframe Found');
  }

  clearFsHidden(): void {
    const message = {
      messageType: 'removeFsHiddenRequest',
      payload: null,
    };

    // @ts-ignore - doesn't like typing
    document.getElementById('theFrame2').contentWindow.postMessage(message);
  }

  applyFieldStatusMessages(statusMessages: TStatusRecord[]) {
    const message = {
      messageType: 'applyFieldStatusMessages',
      payload: { fieldStatusMessages: statusMessages },
    };
    // @ts-ignore - doesn't like typing
    document.getElementById('theFrame2').contentWindow.postMessage(message);
  }

  applyLogicStatusMessages(
    rootFieldId: string,
    statusMessages: TStatusRecord[],
    allFieldSummary: {
      [fieldId: string]: { fieldType: string; fieldId: string; label: string };
    }
  ) {
    // fieldId, {dependentFieldIds, interdependentFieldIds, statusMessages}
    // const { dependentsByFieldId, allFieldIds } = payload;

    const message = {
      messageType: 'applyLogicStatusMessages',
      payload: {
        dependentsByFieldId: {
          [rootFieldId]: {
            dependentFieldIds: [],
            interdependentFieldIds: [],
            statusMessages: statusMessages,
          },
        },
        allFieldSummary,
        // fieldStatusMessages:
        // statusMessages
      },
    };
    // @ts-ignore - doesn't like typing
    document.getElementById('theFrame2').contentWindow.postMessage(message);
  }

  public component = ({
    // statusMessage,
    formHtml,
    context: any,
  }: Props): ReactElement => {
    const iFrame = (
      <iframe
        id="theFrame2"
        name="theFrame2"
        // <meta https-equiv="Content-Security-Policy" content="default-src *;" />
        style={{
          width: '100%',
          height: '1000px',
          top: '150px',
          position: 'absolute',
          left: '100%',
        }}
        // sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation"
        // sandbox="allow-same-origin"
        // srcDoc={this._helperHtml}
        srcDoc={this._helperHtml + formHtml}
      ></iframe>
    );
    // this.applyFieldStatusMessages(statusMessage);
    return iFrame;
    // return (
    //   <iframe
    //     id="theFrame2"
    //     name="theFrame2"
    //     // <meta https-equiv="Content-Security-Policy" content="default-src *;" />
    //     style={{
    //       width: '100%',
    //       height: '1000px',
    //       top: '150px',
    //       position: 'absolute',
    //       left: '100%',
    //     }}
    //     // sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation"
    //     // sandbox="allow-same-origin"
    //     // srcDoc={this._helperHtml}
    //     srcDoc={this._helperHtml + formHtml}
    //   ></iframe>
    // );
  };
  // return iFrame;
  // return (
  //   <iframe
  //     id="theFrame"
  //     name="theFrame"
  //     style={{
  //       width: '100%',
  //       height: '1000px',
  //       top: '150px',
  //       position: 'absolute',
  //     }}
  //     srcDoc={formHtml}
  //   ></iframe>
  //   // <div
  //   //   dangerouslySetInnerHTML={{ __html: formHtml || 'No Form HTML.' }}
  //   // ></div>
  // );
}

function getChildFrameHtml() {
  const url = chrome.runtime.getURL('form-view-helper.html');

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

// window.onmessage = function (e) {
//   switch (e.data.messageType) {
//     case 'getAllFieldInfoRequest':
//       e.source && handleGetAllFieldInfoRequest(e.source, e.data.payload);
//       !e.source && console.log('No Source of message received.');
//       break;
//   }
// };

export { FormView };
