import React, { ReactElement, useEffect, useState } from 'react';
import { TStatusRecord } from '../../../../formstack/classes/Evaluator/type';

const fetchTreeFormId = '5375703';
const fetchSubmissionId = '1129952515';
interface Props {
  formHtml?: string;
  context?: any;
  statusMessage: TStatusRecord[];
}

class FormView {
  static IFRAME_ID = 'fsBuddyFormView';
  _helperHtml!: string;
  _allFieldSummary!: {
    [fieldId: string]: { fieldType: string; fieldId: string; label: string };
  };

  async initialize(): Promise<void> {
    try {
      this._helperHtml = await getChildFrameHtml();
    } catch (e) {
      console.log({
        message: 'failed to get form iframe html.',
        e,
      });
    }

    window.onmessage = function (e) {
      switch (e.data.messageType) {
        case 'announceAwake':
          // console.log({ announceAwake: 'received' });
          break;
        case 'removeFsBuddyRequest':
          const iframe = document.getElementById(FormView.IFRAME_ID);
          if (iframe) {
            iframe.remove();
          }
          break;
        default:
      }
    };
  }

  _removeAllCssName(cssClassName: string): void {
    const iframe = document.getElementById(FormView.IFRAME_ID);
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

    this.postMessageToIframe(message);
  }

  applySubmissionDataStatusMessages(
    submissionId: string,
    submissionUiDataItems: any
  ) {
    const message = {
      messageType: 'fetchSubmissionResponse',
      payload: {
        id: submissionId,
        submissionData: submissionUiDataItems,
      },
    };

    this.postMessageToIframe(message);
  }

  applyFieldStatusMessages(statusMessages: TStatusRecord[]) {
    const message = {
      messageType: 'applyFieldStatusMessages',
      payload: { fieldStatusMessages: statusMessages },
    };

    this.postMessageToIframe(message);
  }

  applyLogicStatusMessages(
    rootFieldId: string,
    statusMessages: TStatusRecord[],
    allFieldSummary: {
      [fieldId: string]: { fieldType: string; fieldId: string; label: string };
    }
  ) {
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
    this.postMessageToIframe(message);
  }

  private postMessageToIframe(message: any) {
    const iFrame = document.getElementById(FormView.IFRAME_ID);

    if (!iFrame) {
      return;
    }

    // @ts-ignore - doesn't like typing
    iFrame.contentWindow.postMessage(message);
  }

  public component = ({ formHtml, context: any }: Props): ReactElement => {
    return (
      <iframe
        id={FormView.IFRAME_ID}
        name={FormView.IFRAME_ID}
        style={{
          width: '100%',
          height: '1000px',
          top: '150px',
          position: 'absolute',
          left: '100%',
        }}
        srcDoc={this._helperHtml + formHtml}
      ></iframe>
    );
  };
}

function getChildFrameHtml() {
  const url = chrome.runtime.getURL('form-view-helper.html');

  return fetch(url).then((response) => {
    return response.text();
  });
}

export { FormView };
