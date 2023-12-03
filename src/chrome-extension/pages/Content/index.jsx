import React from 'react';
import { createRoot } from 'react-dom/client';

import ContentScript from './ContentScript';
// import './index.css';


const createElementButton = ({ label, onclick }) => {
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
    fsBodyControlPanel.id = "fsBodyControlPanel"
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
  

initializeFsBuddyControlPanel();
// const container = document.getElementById('app-container');
// fsBodyControlPanel
const container = document.getElementById('fsBodyControlPanel');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(<ContentScript title={'Settings'} />);
