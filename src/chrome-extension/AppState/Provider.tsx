import React, { useState, useContext } from 'react';
import { createContext, useReducer } from 'react';
import { UIStateType } from './types';
import { UIStateReducer } from './Reducer';

// import { UIStatueContext } from './UIStatueContext';
export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

const createInitialState = (): UIStateType => {
  return {
    messageFilter: {
      selectedLogLevels: [],
      searchText: '',
      filteredMessages: [],
    },
    apiResponse: {
      fieldSummary: {}, //any;
      formStatusMessages: [], //TStatusRecord[];
      formLogicStatusMessages: [], //TStatusRecord[];
      fieldStatusMessages: [], //TStatusRecord[];
      allStatusMessages: [], // TStatusRecord[];
      fieldIdsWithLogic: [], // { value: string; label: string }[];
      formHtml: null,
      formJson: null,
    },
    logicFieldSelected: {
      logicalNodeGraphMap: [],
      fieldId: null,
      statusMessages: [],
      allFieldSummary: {}, // fromAp
      allLogicId: '',
    },
    submissionSelected: {
      submissionId: null,
      submissionUiDataItems: [],
    },
    offFormLogic: {
      formLogic: [],
      notificationEmails: [],
      confirmationEmails: [],
      webhooks: [],
      allOffFormLogic: [],
    },
  };
};

const initialUiState: UIStateType = createInitialState();

const UIStateContext = createContext(initialUiState);
// const UIStateDispatch = createContext((action: any) => {
//   console.log({ contextAction: action });
// });
const UIStateDispatch = createContext(null as any);

function UIStateContextProvider({ children }: { children: any }) {
  const [uiState, dispatch] = useReducer(
    UIStateReducer,
    initialUiState,
    createInitialState
  );

  return (
    <UIStateContext.Provider value={uiState}>
      <UIStateDispatch.Provider value={dispatch}>
        {children}
      </UIStateDispatch.Provider>
    </UIStateContext.Provider>
  );
}

// function useUIStateDispatch() {
//   return useContext(UIStateContext);
// }
export { initialUiState };
export { UIStateContextProvider, UIStateContext, UIStateDispatch };
