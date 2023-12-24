console.log('This is the background page.');
console.log('Put the background scripts here.');

// aka service worker

console.log("hello from formstackApi.js");
import { TreeManager } from "../../common/TreeManager";
import { SubmissionManager } from "../../common/SubmissionManager";

// import { ApiSubmissionCacheManager } from "../common/ApiSubmissionCacheManager";
// @ts-ignore 'oninstall' not on Window
// self.oninstall = () => {
//   // The imported script shouldn't do anything, but only declare a global function
//   // (someComplexScriptAsyncHandler) or use an analog of require() to register a module
// };

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  const { apiKey, fetchFormId } = message;
  console.log({background:true, message})
  switch (message.type) {
    case "GetFormAsJson":
      TreeManager.getInstance()
        .getTree(apiKey, fetchFormId)
        .then((treeJson) => {
          senderResponse(treeJson);
        })
        .catch((e) => {
          console.log("Failed to GetFormAsJson");
          console.log(e);
          senderResponse(e);
        });
      break;
      case "GetWebhooksAsJson":
        TreeManager.getInstance()
          .getWebhookJson(apiKey, fetchFormId)
          .then((treeJson) => {
            senderResponse(treeJson);
          })
          .catch((e) => {
            console.log("Failed to GetWebhooksAsJson");
            console.log(e);
            senderResponse(e);
          });
        break;
        case "GetConfirmationEmailsAsJson":
          TreeManager.getInstance()
          .getConfirmationEmailJson(apiKey, fetchFormId)
          .then((treeJson) => {
            senderResponse(treeJson);
          })
          .catch((e) => {
            console.log("Failed to GetWebhooksAsJson");
            console.log(e);
            senderResponse(e);
          });
        break;
        case "GetNotificationEmailsAsJson": 
        TreeManager.getInstance()
          .getNotificationEmailJson(apiKey, fetchFormId)
          .then((treeJson) => {
            senderResponse(treeJson);
          })
          .catch((e) => {
            console.log("Failed to GetWebhooksAsJson");
            console.log(e);
            senderResponse(e);
          });        break;

      case "GetSubmissionFromApiRequest":
      const { submissionId } = message;
      console.log({submissionId}); 
      SubmissionManager.getInstance()
        .getSubmission(apiKey, submissionId)
        .then((submissionJson) => {
          senderResponse(submissionJson);
        });
      break;
  }
  return true;
});
