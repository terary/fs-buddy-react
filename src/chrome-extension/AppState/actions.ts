import { TStatusRecord } from '../../components/StatusMessageListContainer/type';
import {
  UIStateApiResponseFormGetType,
  UIStateLogicFieldSelected,
  UIStateSubmissionSelected,
  UIStateType,
} from './types';

// dispatcher({
//     type: 'apiResponse',
//     payload: {
//       apiResponse: {
//         allStatusMessages: [
//           ...formStatusMessages,
//           ...formLogicStatusMessages,
//         ],
//       },
//     },
//   });

const apiResponseGetForm = (
  state: UIStateType,
  payload: Partial<UIStateApiResponseFormGetType>
) => {
  const { apiResponse } = state;
  const newApiResponse = { ...apiResponse, ...payload };
  return {
    type: 'apiResponse/getForm',
    payload: {
      apiResponse: newApiResponse,
    },
  };
};

const updateMessageFilter = (
  state: UIStateType,
  messageFilterChanges: Partial<UIStateType['messageFilter']>
) => {
  const { messageFilter } = state;
  const newMessageFilterState = {
    ...messageFilter,
    ...messageFilterChanges,
  };
  //   const revisedState = {
  //     ...state,
  //     ...{ messageFilter: { ...newMessageFilterState } },
  //   };
  return {
    type: 'messageFilter/selectedLogLevels/update',
    payload: {
      messageFilter: newMessageFilterState,
    },
  };
};

const updateLogicFieldSelected = (
  state: UIStateType,
  logicFieldSelectedChanges: Partial<UIStateLogicFieldSelected>
) => {
  const { logicFieldSelected } = state;
  const newLogicFieldSelected = {
    ...logicFieldSelected,
    ...logicFieldSelectedChanges,
  };
  console.log({
    updateLogicFieldSelected: { logicFieldSelectedChanges, state },
  });
  return {
    type: 'logic/selectedField/update',
    payload: {
      logicFieldSelected: newLogicFieldSelected,
    },
  };
};

const updateSubmissionSelected = (
  state: UIStateType,
  submissionSelectedChanges: Partial<UIStateSubmissionSelected>
) => {
  const { submissionSelected } = state;
  const newSubmissionSelected = {
    ...submissionSelected,
    ...submissionSelectedChanges,
  };
  //   console.log({
  //     updateLogicFieldSelected: { logicFieldSelectedChanges, state },
  //   });
  return {
    type: 'apiResponse/getSubmission',
    payload: {
      submissionSelected: newSubmissionSelected,
    },
  };
};

// 'logic/selectedField/update'
const actions = {
  messageFilter: {
    update: updateMessageFilter,
  },
  apiResponse: {
    getForm: apiResponseGetForm,
  },
  logic: {
    updateSelectedField: updateLogicFieldSelected,
  },
  submissionSelected: {
    update: updateSubmissionSelected,
  },
};

export { actions };
