import React from 'react';
import { ApiKeyContainer } from './ApiKeyContainer';
//import './Options.css';

interface Props {
  title: string;
}

const ContentScript: React.FC<Props> = ({ title }: Props) => {
  return (
    <div className="ContentContainer">
      {title} Page
      <ApiKeyContainer title="The Title" />
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

function getFormAsJson() {
  // removeFormHtml();
  // const fetchTreeFormId = getFormIdFromLocation();
  const fetchTreeFormId = '5079339';
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
        const iframe = buildIframe('theFrame');
        iframe.srcdoc = childFrameHtml + apiFormJson.html;
        const theBody = document.querySelector('body');
        theBody?.prepend(iframe);

        if (!apiFormJson.id) {
          // if there is no formId, then we probably didn't get real 200
          throw new Error(
            'Unrecognized response' + JSON.stringify(apiFormJson)
          );
        }

        // currentFieldCollection = FsFormModel.fromApiFormJson(
        //   transformers.formJson(apiFormJson)
        // );

        // formAnalytic =
        //   FormstackBuddy.getInstance().getFormAnalyticService(apiFormJson);

        // fieldLogicService = FormstackBuddy.getInstance().getFieldLogicService(
        //   transformers.formJson(apiFormJson)
        // );
      }
    );
  } else {
    console.log('Failed to fetchTree, could not get formId from url');
  }
}
getFormAsJson();
export default ContentScript;
