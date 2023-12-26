import { transformers } from '.';
import { TOffFormLogicEntity } from '../../chrome-extension/AppState/types';
import { FsFormModel } from '../classes/subtrees';
interface IOffFormLogic {
  id: string;
  name: string;
  logic: any;
}

type OffFormLogicEntityType =
  | 'notificationEmail'
  | 'confirmationEmail'
  | 'webhook';

type TOffFormLogicEntityTag = 'NE' | 'CE' | 'WH' | '??';
const logicItemEntityToTag = (
  entityType: OffFormLogicEntityType
): TOffFormLogicEntityTag => {
  switch (entityType) {
    case 'confirmationEmail':
      return 'CE';
    case 'notificationEmail':
      return 'NE';
    case 'webhook':
      return 'WH';
    default:
      return '??';
  }
};

const transformLogicJsonToOffFormLogic = (
  offFormLogicJson: IOffFormLogic,
  entityType: OffFormLogicEntityType,
  formModel: FsFormModel
): TOffFormLogicEntity => {
  const entityTag = logicItemEntityToTag(entityType);
  const agTree = formModel.aggregateOffFormLogicJson(offFormLogicJson.logic);
  console.log({
    transformJsonToOffFormLogic: {
      entityTag,
      name: offFormLogicJson.name,
      agTree,
    },
  });
  const pojo = agTree ? agTree.toPojoAt(undefined, false) : {};
  const graphMap = transformers.pojoToD3TableData(pojo, formModel);

  return {
    id: `${entityTag}-` + offFormLogicJson.id,
    name: `[${entityTag}]` + offFormLogicJson.name,
    graphMap,
    statusMessages: agTree?.getStatusMessage() || [],
    entityType,
  };
};
export { transformLogicJsonToOffFormLogic };
