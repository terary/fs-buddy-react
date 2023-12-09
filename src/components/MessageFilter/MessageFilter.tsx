import React, { useState } from 'react';

// import styles from './MessageFilter.module.css';
import './MessageFilter.module.css';
import { TStatusRecord } from '../StatusMessageListContainer/type';
import { StatusMessageContainer } from '../StatusMessageListContainer/StatusMessageContainer';
import { StatusMessageListContainer } from '../StatusMessageListContainer';
import { CheckboxArray } from '../CheckboxArray';
// interface CheckboxProps {
//   label: string;
//   value: boolean;
// }
// interface Props {
//   props: { [checkboxKey: string]: CheckboxProps };
//   onChange?: (currentValues: { [valueKey: string]: boolean }) => void;
// }
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
    value: true,
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
    value: false,
  },
  logic: {
    label: 'Logic',
    value: true,
  },
};
const getApplicableFilters = (
  filterCollection: LogFilterCollectionType
): string[] => {
  return Object.entries(filterCollection)
    .filter(([logName, filterObject]) => {
      return filterObject.value;
    })
    .map(([logName, filterObject]) => {
      return logName;
    });
};

const MessageFilter = ({
  statusMessages = [],
  onFiltered,
}: {
  statusMessages?: TStatusRecord[];
  onFiltered: (statusMessages: TStatusRecord[]) => void;
}) => {
  const _statusMessages = statusMessages;
  const [controlState, setControlState] = useState({
    appliedFilters: getApplicableFilters(logFilterCheckboxesProps),
    statusMessages,
    displayedStatusMessages: statusMessages,
    searchText: '',
  });

  // const [searchText, setSearchText] = useState("");
  const [loggingFilters, setLoggingFilters] = useState(
    logFilterCheckboxesProps
  );
  const [displayedStatusMessages, setDisplayedStatusMessages] =
    useState(_statusMessages);

  // ----------
  const handleLoggingFilterChange = (updatedLoggingFilter: any) => {
    const newState = {
      ...controlState,
      ...{ appliedFilters: getApplicableFilters(updatedLoggingFilter) },
    };

    // setLoggingFilters(updatedLoggingFilter);
    finalizeAndSetControlStatue(newState);
  };

  const handleSearchTextChange = (evt: React.FormEvent<HTMLInputElement>) => {
    const searchText = evt.currentTarget.value || '';
    const newState = { ...controlState, ...{ searchText } };
    // setControlState(newState);
    // setSearchText(searchText);
    finalizeAndSetControlStatue(newState);
  };

  const finalizeAndSetControlStatue = (state: any) => {
    const searchRegExp = new RegExp(state.searchText, 'i');
    const { appliedFilters } = state;
    console.log('Pre loop');

    const filteredMessages = controlState.statusMessages
      .filter((statusMessage) =>
        appliedFilters.includes(statusMessage.severity)
      )
      .filter((statusMessage) => {
        const isMatch = searchRegExp.test(JSON.stringify(statusMessage));
        return isMatch;
      });

    const newState = {
      ...state,
      ...{ displayedStatusMessages: filteredMessages },
    };
    setControlState(newState);
    onFiltered(filteredMessages);
    // setDisplayedStatusMessages(filteredMessages);
  };

  return (
    <div
      className="MessageFilterContainer"
      data-testid="message-filter-container"
    >
      <label>
        <span style={{ marginRight: '1em' }}>Search:</span>
        <input
          id="searchTextInput"
          name="searchTextInput"
          onChange={handleSearchTextChange}
        />
      </label>
      <br />
      <CheckboxArray
        props={loggingFilters}
        onChange={handleLoggingFilterChange}
      />
      {/*
      // debug 
      <div style={{ border: '1px solid black' }}>
        <br />
        Search Text: {controlState.searchText}
        <br />
        applied filters xx: {JSON.stringify(controlState.appliedFilters)}
        <br />
        displayedStatusMessages count:{' '}
        {controlState.displayedStatusMessages.length}
      </div>
  */}
      <StatusMessageListContainer
        statusMessages={controlState.displayedStatusMessages}
      />
    </div>
  );
};

export { MessageFilter };
