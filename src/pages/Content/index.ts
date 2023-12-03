// import { printLine } from './modules/print';
const printLine = require('./modules/print');

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');
printLine.printLine("Using the 'printLine' function from the Print Module");

const createElementButton = ({ label, onclick }: any) => {
  const button = document.createElement('button');
  button.innerHTML = label;
  button.onclick = onclick;
  return button;
};

const initializeFsBuddyControlPanel = () => {
  const theBody = document.querySelector('body');

  const passwordLabel = document.createElement('label');
  passwordLabel.innerText = 'API Key: ';

  // passwordControl.onchange = () => {
  //   if (passwordControl.value.length > 4) {
  //     const pwEndingLastFour = (passwordControl.value || "").slice(-4);
  //     passwordLabel.innerText = "API Key Ending: " + pwEndingLastFour;
  //   } else {
  //     passwordLabel.innerText = "API Key: ";
  //   }
  // };

  passwordLabel.setAttribute('for', 'fsBuddyApiKey');

  const fsBodyControlPanelHead = document.createElement('h3');
  fsBodyControlPanelHead.innerHTML = 'FS Buddy Control Panel';
  fsBodyControlPanelHead.style.color = 'black';

  const fsBodyControlPanelGetFormHtmlButton = createElementButton({
    label: 'Open FS Buddy',
    //   onclick: getFormAsJson,
  });

  const removeFormHtmlButton = createElementButton({
    label: 'Close FS Buddy',
    //   onclick: removeFormHtml,
  });

  const fsBodyControlPanel = document.createElement('div');
  fsBodyControlPanel.appendChild(fsBodyControlPanelHead);
  fsBodyControlPanel.appendChild(fsBodyControlPanelGetFormHtmlButton);
  fsBodyControlPanel.appendChild(removeFormHtmlButton);
  fsBodyControlPanel.appendChild(document.createElement('hr'));
  fsBodyControlPanel.appendChild(passwordLabel);
  // fsBodyControlPanel.appendChild(passwordControl);

  fsBodyControlPanel.style.backgroundColor = '#FFFFFF';
  fsBodyControlPanel.style.border = '1px black solid';

  //   fsBodyControlPanel.style.height = '500px';
  // fsBodyControlPanel.style.width = "50%";
  // fsBodyControlPanel.style.width = "500px";
  fsBodyControlPanel.style.zIndex = '1000';
  fsBodyControlPanel.style.top = '0px';
  fsBodyControlPanel.style.left = '0px';
  fsBodyControlPanel.style.position = 'absolute';

  theBody && theBody.appendChild(fsBodyControlPanel);
};

function getFormIdFromLocation({ pathname }: Location = location) {
  const regExp = /\/admin\/form\/builder\/(?<formId>\d+)\/build(\/*)+/g;
  return regExp.exec(pathname)?.groups?.formId || null;
}
const formId = getFormIdFromLocation();

// if (formId) {
//   initializeFsBuddyControlPanel();
// }
initializeFsBuddyControlPanel();
