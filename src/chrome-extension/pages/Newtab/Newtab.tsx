import React, { useState, useEffect } from 'react';
import 'primereact/resources/themes/md-light-deeppurple/theme.css';
import { App } from '../../App';

const Newtab: React.FC = () => {
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

export default Newtab;
