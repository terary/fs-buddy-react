import React, { useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { UIStateDispatch } from '../../AppState';

interface Props {
  apiKey: null | string;
  formId: null | string;
  onChange: (parameters: {
    apiKey: string | null;
    formId: string | null;
  }) => void;
}
const ApiKeyContainer: React.FC<Props> = ({
  apiKey,
  formId,
  onChange,
}: Props) => {
  const dispatcher = useContext(UIStateDispatch);

  const handleTextChange = (
    input: 'apiKey' | 'formId',
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = evt.target.value || null;
    const newValue = { ...{ apiKey, formId }, ...{ [input]: value } };
    onChange(newValue);
  };

  return (
    <div>
      <InputText
        placeholder="API Key"
        value={apiKey || ''}
        onChange={(e) => handleTextChange('apiKey', e)}
      />
      <InputText
        placeholder="Form ID"
        style={{ marginLeft: '10px' }}
        value={formId || ''}
        onChange={(e) => handleTextChange('formId', e)}
      />
    </div>
  );
};

export { ApiKeyContainer };
