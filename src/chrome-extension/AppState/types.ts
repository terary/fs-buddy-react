// import { TUiEvaluationObject } from '../../formstack/classes/Evaluator/type';
import type {
  TUiEvaluationObject,
  TGraphNode,
  TApiForm,
  TStatusMessageSeverity,
  TStatusRecord,
} from '../../formstack';

type FieldFewDetailsType = {
  fieldId: string;
  label: string;
  type: string; // there is a type for this
};

type UIStateLogicFieldSelected = {
  logicalNodeGraphMap: TGraphNode[];
  fieldId: string | null;
  statusMessages: TStatusRecord[];
  allFieldSummary: any; // fromApi
  allLogicId: string; // all logic goes in an array of objects with the 'id' property
};

type UIStateSubmissionSelected = {
  submissionId: string | null;
  submissionUiDataItems: TUiEvaluationObject[];
};

type TOffFormLogicEntity = {
  entityType:
    | 'webhook'
    | 'confirmationEmail'
    | 'notificationEmail'
    | 'integration'
    | 'formLogic';
  graphMap: TGraphNode[];
  statusMessages: TStatusRecord[];
  id: string;
  name: string;
};

type UIStateOffFormLogic = {
  notificationEmails: TOffFormLogicEntity[];
  webhooks: TOffFormLogicEntity[];
  confirmationEmails: TOffFormLogicEntity[];
  formLogic: TOffFormLogicEntity[];
  allOffFormLogic: TOffFormLogicEntity[];
};

type UIStateApiResponseFormGetType = {
  // const payload = {
  fieldSummary: { [fieldId: string]: FieldFewDetailsType };
  formStatusMessages: TStatusRecord[];
  formLogicStatusMessages: TStatusRecord[];
  fieldStatusMessages: TStatusRecord[];
  allStatusMessages: TStatusRecord[];
  fieldIdsWithLogic: { value: string; label: string }[];
  formHtml: string | null;
  formJson: null | undefined | string | TApiForm;
  // };
};

type UIStateType = {
  messageFilter: {
    selectedLogLevels: TStatusMessageSeverity[];
    filteredMessages: TStatusRecord[];
    searchText: string;
  };
  apiResponse: UIStateApiResponseFormGetType;
  logicFieldSelected: UIStateLogicFieldSelected;
  submissionSelected: UIStateSubmissionSelected;
  offFormLogic: UIStateOffFormLogic;
};

type UIStateActionType<T = any> = {
  type:
    | 'apiResponse'
    | 'apiResponse/getForm'
    | 'apiResponse/getSubmission'
    | 'logic/selectedField/update'
    | 'messageFilter/filteredMessages/update'
    | 'messageFilter/selectedLogLevels/update'
    | 'offFormLogic/update';
  payload: T;
};

export type {
  TOffFormLogicEntity,
  UIStateActionType,
  UIStateApiResponseFormGetType,
  UIStateLogicFieldSelected,
  UIStateOffFormLogic,
  UIStateSubmissionSelected,
  UIStateType,
};
