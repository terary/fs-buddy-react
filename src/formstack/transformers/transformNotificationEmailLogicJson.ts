import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsJunctionOperators,
} from '../classes/subtrees/types';

const transformNotificationEmailLogicJson = (
  logic: TFsFieldLogicJunctionJson
): TFsFieldLogicJunction<TFsJunctionOperators> => {
  const checks =
    !logic || !logic.checks || !Array.isArray(logic.checks)
      ? []
      : (logic.checks || []).map(
          (check: TFsFieldLogicCheckLeafJson): TFsFieldLogicCheckLeaf => {
            return {
              ...check,
              ...{ fieldId: check.field },
            } as TFsFieldLogicCheckLeaf;
          }
        );
  return {
    ...logic,
    ...{
      checks,
    },
  } as TFsFieldLogicJunction<TFsJunctionOperators>;
};

export { transformNotificationEmailLogicJson };
