import { TApiFormFromJson } from './TApiFormFromJson';
import { TFsFieldAnyFromJson } from './TFsFieldAnyFromJson';
import { TFsFieldLogicJunctionFromJson } from './TFsFieldLogicJunctionFromJson';
import { pojoToD3TableData } from './pojoToD3TableData';
import { transformNotificationEmailLogicJson } from './transformNotificationEmailLogicJson';
import { transformLogicJsonToOffFormLogic } from './transformLogicJsonToOffFormLogic';
import { Utility } from './Utility';
import {
  TFsFieldLogicNodeToPojo,
  TFsFieldLogicNodeFromPojo,
} from './TFsLogicNodeToPojo';
export const transformers = {
  fieldJson: TFsFieldAnyFromJson,
  formJson: TApiFormFromJson,
  logicJunctionJson: TFsFieldLogicJunctionFromJson,
  offFormLogicJsonToLogic: transformLogicJsonToOffFormLogic,
  notificationEmailLogicJson: transformNotificationEmailLogicJson,
  TFsFieldLogicNode: {
    fromPojo: TFsFieldLogicNodeFromPojo,
    toPojo: TFsFieldLogicNodeToPojo,
  },
  pojoToD3TableData,
  Utility,
};
