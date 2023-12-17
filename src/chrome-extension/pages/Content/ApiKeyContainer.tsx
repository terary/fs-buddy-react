import React, { useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import {
  UIStateContextProvider,
  UIStateContext,
  UIStateDispatch,
} from '../../AppState';

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

  const handleStateUpdate = () => {
    dispatcher({
      type: 'messageFilter/selectedLogLevels/update',
      payload: {
        messageFilter: {
          selectedLogLevels: ['info', 'warn'],
          searchText: 'Search Text from APIKeyContainer.tsx',
        },
      },
    });
  };

  return (
    <div>
      <button onClick={handleStateUpdate}>Update State</button>
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
