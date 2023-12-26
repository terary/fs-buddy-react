import { AbstractLogicNode } from './classes/subtrees/trees/FsLogicTreeDeep/LogicNodes/AbstractLogicNode';

type TGraphNode = {
  nodeId: string;
  parentId: string;
  nodeContent: {
    fieldId: string;
    nodeId: string;
    label: string;
    operationLabel?: string[];
    operand?: string; // TFLeafOperator | TFJunctionOperator
    nodeType: keyof AbstractLogicNode;
  };
};
export type { TGraphNode };
