import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
// import 'primereact/resources/themes/md-light-deeppurple/theme.css';
// import 'primereact/resources/themes/mdc-light-indigo/theme.css';
import './MessageFilter.module.css';
import { TStatusRecord } from '../StatusMessageListContainer/type';
import { StatusMessageContainer } from '../StatusMessageListContainer/StatusMessageContainer';
import { StatusMessageListContainer } from '../StatusMessageListContainer';
import { CheckboxArray } from '../CheckboxArray';

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
): string[] => {
  return Object.entries(filterCollection)
    .filter(([logName, filterObject]) => {
      return filterObject.value;
    })
    .map(([logName, filterObject]) => {
      return logName;
    });
};

const getFilteredMessages = (
  appliedFilters: any,
  searchText: string,
  statusMessages: TStatusRecord[]
) => {
  const searchRegExp = new RegExp(searchText, 'i');
  const filteredMessages = statusMessages
    .filter((statusMessage) => appliedFilters.includes(statusMessage.severity))
    .filter((statusMessage) => {
      const isMatch = searchRegExp.test(JSON.stringify(statusMessage));
      return isMatch;
    });

  return filteredMessages;
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
    displayedStatusMessages: getFilteredMessages(
      getApplicableFilters(logFilterCheckboxesProps),
      '',
      statusMessages
    ),
    searchText: '',
  });

  // const [searchText, setSearchText] = useState("");
  const [loggingFilters, setLoggingFilters] = useState(
    logFilterCheckboxesProps
  );
  // const [displayedStatusMessages, setDisplayedStatusMessages] =
  //   useState(_statusMessages);

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
    finalizeAndSetControlStatue(newState);
  };

  const finalizeAndSetControlStatue = (state: any) => {
    const searchRegExp = new RegExp(state.searchText, 'i');
    const { appliedFilters } = state;
    console.log('Pre loop');
    const filteredMessages = getFilteredMessages(
      appliedFilters,
      state.searchText,
      controlState.statusMessages
    );
    // const filteredMessages = controlState.statusMessages
    //   .filter((statusMessage) =>
    //     appliedFilters.includes(statusMessage.severity)
    //   )
    //   .filter((statusMessage) => {
    //     const isMatch = searchRegExp.test(JSON.stringify(statusMessage));
    //     return isMatch;
    //   });

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
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Search" onChange={handleSearchTextChange} />
      </span>
      <CheckboxArray
        props={loggingFilters}
        onChange={handleLoggingFilterChange}
      />
      <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
        <StatusMessageListContainer
          statusMessages={controlState.displayedStatusMessages}
        />
      </div>
    </div>
  );
};

export { MessageFilter };
