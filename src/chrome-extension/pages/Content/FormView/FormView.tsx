import React, { ReactElement, useContext, useEffect, useState } from 'react';
import type { TStatusRecord } from '../../../../formstack';
import './FormView.css';
import { UIStateContext } from '../../../AppState';
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

  static clearFsHidden(): void {
    const message = {
      messageType: 'removeFsHiddenRequest',
      payload: null,
    };

    FormView.postMessageToIframe(message);
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
    console.log({ applySubmissionDataStatusMessages: { message } });
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
  private static postMessageToIframe(message: any) {
    const iFrame = document.getElementById(FormView.IFRAME_ID);

    if (!iFrame) {
      return;
    }

    // @ts-ignore - doesn't like typing
    iFrame.contentWindow.postMessage(message);
  }

  // public component = ({ formHtml, context: any }: Props): ReactElement => {
  public component = (): ReactElement => {
    const uiStateContext = useContext(UIStateContext);
    const stateFormHtml = uiStateContext.apiResponse.formHtml;
    useEffect(() => {
      this.applyFieldStatusMessages(
        uiStateContext.messageFilter.filteredMessages
      );
    }, [uiStateContext.messageFilter.filteredMessages]);

    useEffect(() => {
      uiStateContext.logicFieldSelected.fieldId &&
        this.applyLogicStatusMessages(
          uiStateContext.logicFieldSelected.fieldId,
          uiStateContext.logicFieldSelected.statusMessages,
          uiStateContext.logicFieldSelected.allFieldSummary
        );
    }, [uiStateContext.logicFieldSelected.statusMessages]);

    useEffect(() => {
      uiStateContext.submissionSelected.submissionId &&
        this.applySubmissionDataStatusMessages(
          uiStateContext.submissionSelected.submissionId,
          uiStateContext.submissionSelected.submissionUiDataItems
        );
    }, [uiStateContext.submissionSelected.submissionUiDataItems]);

    // useEffect(() => {
    //   statusMessages && this.applyFieldStatusMessages(statusMessages);
    // }, []);

    return (
      <iframe
        id={FormView.IFRAME_ID}
        name={FormView.IFRAME_ID}
        className="formViewIframeContainer"
        // style={{
        //   width: '100%',
        //   height: '1000px',
        //   top: '150px',
        //   position: 'absolute',
        //   left: '100%',
        // }}
        // srcDoc={this._helperHtml + formHtml}
        srcDoc={this._helperHtml + `${stateFormHtml}`}
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
