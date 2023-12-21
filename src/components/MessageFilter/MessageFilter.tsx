import React, { useContext, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import {
  UIStateContext,
  UIStateDispatch,
  actions,
} from '../../chrome-extension/AppState';
import { Button } from 'primereact/button';
// import { FormView } from '../pages/Content/FormView/FormView';
import { FormView } from '../../chrome-extension/pages/Content/FormView/FormView';

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

    const newState = { ...uiStateContext };
    newState.messageFilter.searchText = (searchText || '').replace(
      /[^\w -]/g, // alphanumeric [space] _ -, but no other special characters
      ''
    );

    finalizeAndSetControlStatue(newState);
  };

  const handleClearAllStatusMessage = async () => {
    const message = {
      messageType: 'clearAllStatusMessages',
      payload: null,
    };

    // @ts-ignore
    document
      .getElementById(FormView.IFRAME_ID)
      // @ts-ignore
      .contentWindow.postMessage(message);
  };

  const handleClearFsHidden = () => {
    FormView.clearFsHidden();
  };

  const finalizeAndSetControlStatue = (revisedState: any) => {
    const { messageFilter } = revisedState;
    console.log({
      finalizeAndSetControlStatue: {
        revisedState,
        allMessages: uiStateContext.apiResponse.allStatusMessages,
      },
    });
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
      <div>
        <div style={{ float: 'left', display: 'inline', paddingRight: '30px' }}>
          <InputText
            id="message-filter-search-text"
            style={{ margin: '5px', width: '20rem' }}
            placeholder="Search"
            onChange={handleSearchTextChange}
          />

          <CheckboxArray
            props={logFilterCheckboxesProps}
            onChange={handleLoggingFilterChange}
          />
        </div>
        <div style={{ paddingLeft: '150px' }}>
          <table>
            <tr>
              <td>Selected Log levels:</td>
              <td>
                {JSON.stringify(uiStateContext.messageFilter.selectedLogLevels)}
              </td>
            </tr>
            <tr>
              <td>Search Text:</td>
              <td>{JSON.stringify(uiStateContext.messageFilter.searchText)}</td>
            </tr>
            <tr>
              <td>All Messages Count</td>
              <td>{uiStateContext.apiResponse.allStatusMessages.length}</td>
            </tr>
            <tr>
              <td>Filtered Messages Count</td>
              <td>{uiStateContext.messageFilter.filteredMessages.length}</td>
            </tr>
            <tr>
              <td>
                <Button onClick={handleClearAllStatusMessage}>
                  Clear All Status Messages
                </Button>
              </td>
              <td>
                <Button
                  style={{ marginLeft: '10px' }}
                  onClick={handleClearFsHidden}
                >
                  Clear fsHidden Classes
                </Button>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
        <StatusMessageListContainer
          statusMessages={uiStateContext.messageFilter.filteredMessages}
        />
      </div>
    </div>
  );
};

export { MessageFilter };
