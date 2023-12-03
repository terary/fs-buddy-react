import React from 'react';
//import './Options.css';

interface Props {
  title: string;
}

const ApiKeyContainer: React.FC<Props> = ({ title }: Props) => {
  return (
    <div>
      <label htmlFor="txtApiKey">Api Key</label>
      <input id="txtApiKey" />
    </div>
  );
};

export { ApiKeyContainer };
