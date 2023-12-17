import React, { useContext, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import {
  UIStateContext,
  UIStateDispatch,
  actions,
} from '../../chrome-extension/AppState';
// import 'primereact/resources/themes/md-light-deeppurple/theme.css';
// import 'primereact/resources/themes/mdc-light-indigo/theme.css';
import './MessageFilter.module.css';
import { TStatusRecord } from '../StatusMessageListContainer/type';
import { StatusMessageContainer } from '../StatusMessageListContainer/StatusMessageContainer';
import { StatusMessageListContainer } from '../StatusMessageListContainer';
import { CheckboxArray } from '../CheckboxArray';
import { TStatusMessageSeverity } from '../../formstack/classes/Evaluator/type';

type LogFilterType = {
  label: string;
  value: boolean;
};
type LogFilterCollectionType = {
  [logName: string]: LogFilterType;
};
const logFilterCheckboxesProps: LogFilterCollectionType = {
  debug: {
    label: 'Debug',
    value: false,
  },
  info: {
    label: 'Info',
    value: false,
  },
  warn: {
    label: 'Warn',
    value: true,
  },
  error: {
    label: 'Error',
    value: true,
  },
  logic: {
    label: 'Logic',
    value: true,
  },
};
const getApplicableFilters = (
  filterCollection: LogFilterCollectionType
): TStatusMessageSeverity[] => {
  return Object.entries(filterCollection)
    .filter(([logName, filterObject]) => {
      return filterObject.value;
    })
    .map(([logName, filterObject]) => {
      return logName;
    }) as TStatusMessageSeverity[];
};

const getFilteredMessages = (
  appliedFilters: any,
  searchText: string,
  statusMessages: TStatusRecord[]
) => {
  const searchRegExp = new RegExp(searchText, 'i');
  const filteredMessages = statusMessages.filter((statusMessage) =>
    appliedFilters.includes(statusMessage.severity)
  );
  if (searchText && searchText != '') {
    return filteredMessages.filter((statusMessage) => {
      const isMatch = searchRegExp.test(JSON.stringify(statusMessage));
      return isMatch;
    });
  }

  return filteredMessages;
};

const MessageFilter = () => {
  const uiStateContext = useContext(UIStateContext);
  const dispatcher = useContext(UIStateDispatch);

  const handleLoggingFilterChange = (updatedLoggingFilter: any) => {
    const newState = { ...uiStateContext };
    newState.messageFilter.selectedLogLevels =
      getApplicableFilters(updatedLoggingFilter);

    finalizeAndSetControlStatue(newState);
  };

  const handleSearchTextChange = (evt: React.FormEvent<HTMLInputElement>) => {
    const searchText = evt.currentTarget.value || '';
    // const newState = { ...uiStateContext };
    // newState.messageFilter.searchText = searchText;

    const newState = { ...uiStateContext };
    newState.messageFilter.searchText = (searchText || '').replace(
      /[^\w -]/g, // alphanumeric [space] _ -, but no other special characters
      ''
    );

    finalizeAndSetControlStatue(newState);
  };

  const finalizeAndSetControlStatue = (revisedState: any) => {
    const { messageFilter } = revisedState;
    console.log({ finalizeAndSetControlStatue: { revisedState } });
    const filteredMessages = getFilteredMessages(
      messageFilter.selectedLogLevels,
      messageFilter.searchText,
      uiStateContext.apiResponse.allStatusMessages
    );
    dispatcher(
      actions.messageFilter.update(uiStateContext, {
        searchText: messageFilter.searchText,
        selectedLogLevels: messageFilter.selectedLogLevels, // ['info', 'warn', 'error', 'logic'],
        filteredMessages: filteredMessages,
      })
    );
  };

  return (
    <div
      className="MessageFilterContainer"
      data-testid="message-filter-container"
    >
      context.messageFilter.filteredMessages.length:{' '}
      {JSON.stringify(uiStateContext.messageFilter.filteredMessages.length)}
      <br />
      apiResponse Keys:{' '}
      {JSON.stringify(Object.keys(uiStateContext.apiResponse), null, ' ')}
      <br />
      {/* <div style={{ height: '500px', overflowY: 'scroll' }}>
        <code>
          <pre>{JSON.stringify(uiStateContext.apiResponse, null, ' ')}</pre>
        </code>
      </div> */}
      selectedLogLevels:{' '}
      {JSON.stringify(uiStateContext.messageFilter.selectedLogLevels)}
      <br />
      searchText: {JSON.stringify(uiStateContext.messageFilter.searchText)}
      <br />
      Object.keys(context.messageFilter):{' '}
      {JSON.stringify(Object.keys(uiStateContext.messageFilter))}
      <br />
      context.apiResponse.allStatusMessages.length:{' '}
      {uiStateContext.apiResponse.allStatusMessages.length}
      {/* {JSON.stringify(context.apiResponse.allStatusMessages.length)} */}
      <br />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Search" onChange={handleSearchTextChange} />
      </span>
      <CheckboxArray
        props={logFilterCheckboxesProps}
        onChange={handleLoggingFilterChange}
      />
      <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
        <StatusMessageListContainer
          statusMessages={uiStateContext.messageFilter.filteredMessages}
        />
      </div>
    </div>
  );
};

export { MessageFilter };
