import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';

const ApiKeyContainer: React.FC = () => {
  const [value, setValue] = useState(' API_KEY_GOES_HERE_ ');
  return <InputText value={value} onChange={(e) => setValue(e.target.value)} />;
  // return (
  //   <div>
  //     <label htmlFor="txtApiKey">Api Key</label>
  //     <input id="txtApiKey" />
  //   </div>
  // );
};

export { ApiKeyContainer };
