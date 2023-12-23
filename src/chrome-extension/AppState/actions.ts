import { TStatusRecord } from '../../components/StatusMessageListContainer/type';
import {
  TOffFormLogicEntity,
  UIStateApiResponseFormGetType,
  UIStateLogicFieldSelected,
  UIStateOffFormLogic,
  UIStateSubmissionSelected,
  UIStateType,
} from './types';

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
  return {
    type: 'logic/selectedField/update',
    payload: {
      logicFieldSelected: newLogicFieldSelected,
    },
  };
};

const updateOffFormLogicLists = (
  state: UIStateType,
  offFormLogicChanges: Partial<UIStateOffFormLogic>
) => {
  const { offFormLogic } = state;
  const stateOffFormLogic = state.offFormLogic;
  const newOffFormLogic = { ...offFormLogic, ...offFormLogicChanges };
  newOffFormLogic.allOffFormLogic = ([] as TOffFormLogicEntity[]).concat(
    // not sure spread works with arrays
    (newOffFormLogic.notificationEmails || []) as TOffFormLogicEntity[],
    (newOffFormLogic.confirmationEmails || []) as TOffFormLogicEntity[],
    newOffFormLogic.formLogic || [],
    newOffFormLogic.webhooks || []
  ) as TOffFormLogicEntity[];
  console.log({
    updateOffFormLogicLists: {
      newOffFormLogic,
      offFormLogic,
      offFormLogicChanges,
      state,
      stateOffFormLogic,
    },
  });
  return {
    type: 'offFormLogic/update',
    payload: {
      offFormLogic: newOffFormLogic,
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
  offFormLogicLists: {
    update: updateOffFormLogicLists,
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
