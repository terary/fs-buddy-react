import {
  TStatusMessageSeverity,
  TStatusRecord,
  TUiEvaluationObject,
} from '../../formstack/classes/Evaluator/type';
import { TGraphNode } from '../../formstack/transformers/pojoToD3TableData';

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
};

type UIStateSubmissionSelected = {
  submissionId: string | null;
  submissionUiDataItems: TUiEvaluationObject[];
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
  formJson: null | undefined | string;
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
};

type UIStateActionType<T = any> = {
  type:
    | 'apiResponse'
    | 'apiResponse/getForm'
    | 'apiResponse/getSubmission'
    | 'logic/selectedField/update'
    | 'messageFilter/filteredMessages/update'
    | 'messageFilter/selectedLogLevels/update';
  payload: T;
};

export type {
  UIStateActionType,
  UIStateApiResponseFormGetType,
  UIStateLogicFieldSelected,
  UIStateSubmissionSelected,
  UIStateType,
};
