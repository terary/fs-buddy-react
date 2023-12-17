import { Reducer } from 'react';

import type { UIStateType, UIStateActionType } from './types';
// export const issuesReducer: Reducer<IssuesInitialState, IssuesAction> = (state, action) => {
//     switch (action.type) {

const UIStateReducer: Reducer<UIStateType, UIStateActionType> = (
  uiState: UIStateType,
  action: UIStateActionType
): UIStateType => {
  console.log({ action, uiState });
  switch (action.type) {
    case 'messageFilter/selectedLogLevels/update': {
      const { selectedLogLevels, searchText, filteredMessages } =
        action.payload.messageFilter || [];
      return {
        ...uiState,
        ...{
          messageFilter: {
            ...{ selectedLogLevels, searchText, filteredMessages },
          },
        },
      };
    }
    case 'messageFilter/filteredMessages/update': {
      const filteredMessages =
        action.payload.messageFilter.filteredMessages || [];
      const newState = { ...uiState };
      newState.messageFilter.filteredMessages = filteredMessages;
      return newState;

      // payload: {
      //   messageFilter: {
      //     filteredMessages: filterStatusMessages(allStatusMessages),
      //   },
    }

    case 'apiResponse/getForm': {
      const { apiResponse } = action.payload || [];
      return {
        ...uiState,
        ...{
          apiResponse: {
            ...apiResponse,
          },
        },
      };
    }
    case 'apiResponse/getSubmission': {
      // const { submissionSelected } = action.payload || [];
      const newState = { ...uiState };
      const { submissionSelected: existingSubmissionSelected } = newState;
      const { submissionSelected: changeSubmissionSelected } = action.payload;

      newState.submissionSelected = {
        ...existingSubmissionSelected,
        ...changeSubmissionSelected,
      };
      return newState;
    }
    case 'logic/selectedField/update': {
      const { logicFieldSelected } = action.payload || [];

      return { ...uiState, ...{ logicFieldSelected } };
    }

    default:
      throw Error('Unknown action: ' + action.type);
  }
};

export { UIStateReducer };
