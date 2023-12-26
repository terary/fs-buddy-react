import { TTreePojo } from 'predicate-tree-advanced-poc/dist/src';
import { FsFormModel } from '../classes/subtrees';
import { AbstractLogicNode } from '../classes/subtrees/trees/FsLogicTreeDeep/LogicNodes/AbstractLogicNode';
import {
  FsCircularDependencyNode,
  FsLogicBranchNode,
  FsLogicLeafNode,
} from '../classes/subtrees/trees/FsLogicTreeDeep';
import { TFsFieldSection } from '../type.field';
import { RuleConflictType } from '../classes/subtrees/trees/FsLogicTreeDeep/LogicNodes/type';

export type TGraphNode = {
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

const truncate = (text = '', length = 25) =>
  text.slice(0, length) + (text.length > length ? '...' : '');

const pojoToD3TableData = (
  pojo: TTreePojo<AbstractLogicNode>,
  formModel: FsFormModel
): TGraphNode[] => {
  return Object.entries(pojo).map(([nodeId, nodeBody]) => {
    // @ts-ignore
    const { nodeContent } = nodeBody;
    let pojoNodeContent = {
      nodeId,
      nodeType: nodeContent.nodeType,
    };

    const fieldId =
      // @ts-ignore
      nodeContent?.ownerFieldId || nodeContent?.fieldId || '_FIELD_ID_';
    // @ts-ignore
    pojoNodeContent.fieldId = fieldId;

    // finish with this label business
    // Probably want "label", "fieldId", "nodeID"
    // also how to present (operator value subject)?
    const fieldModel = formModel.getFieldModel(fieldId);

    switch (nodeContent.nodeType) {
      case 'FsVirtualRootNode':
      case 'FsLogicBranchNode':
        const { action, conditional } = nodeContent as FsLogicBranchNode;
        // @ts-ignore
        (pojoNodeContent.label = truncate(
          fieldModel?.fieldType === 'section'
            ? // is 'section_heading' valid?
              fieldModel?.label || fieldModel.section_heading
            : fieldModel?.label
        )),
          // @ts-ignore
          (pojoNodeContent.operationLabel = [
            `${action || 'vRoot'}`,
            `if ${conditional}`,
          ]);
        // @ts-ignore
        pojoNodeContent.operand = conditional;

        break;

      case 'FsLogicLeafNode':
        const { condition, option } = nodeContent as FsLogicLeafNode;
        // @ts-ignore
        pojoNodeContent.label = truncate(fieldModel?.label);
        // @ts-ignore
        pojoNodeContent.operationLabel = [`${condition}`, `${option}`];
        // @ts-ignore
        pojoNodeContent.operand = condition;
        break;

      case 'FsCircularDependencyNode':
        const { sourceFieldId, ruleConflict } =
          nodeContent as FsCircularDependencyNode;
        // @ts-ignore - fieldId not element of pojoNodeContent
        pojoNodeContent.fieldId = sourceFieldId;
        // @ts-ignore - ruleConflict not element of pojoNodeContent
        pojoNodeContent.ruleConflict = ruleConflict;
        // @ts-ignore -
        pojoNodeContent.sourceFieldId = nodeContent.sourceFieldId;
        // @ts-ignore -
        pojoNodeContent.sourceNodeId = nodeContent.sourceNodeId;
        // @ts-ignore -
        pojoNodeContent.targetFieldId = nodeContent.targetFieldId;
        // @ts-ignore -
        pojoNodeContent.targetNodeId = nodeContent.targetNodeId;

        const sourceFieldModel = formModel.getFieldModel(sourceFieldId);
        const { conditionalA, conditionalB } = ruleConflict as RuleConflictType;

        // @ts-ignore
        pojoNodeContent.operationLabel = [
          'Circular Ref',
          `A: (${conditionalA.action} / ${conditionalA.condition})`,
          `B: (${conditionalB.action} / ${conditionalB.condition})`,
        ];

        // @ts-ignore - ruleConflict not element of pojoNodeContent
        pojoNodeContent.label = truncate(sourceFieldModel?.label);
        break;

      default:
        pojoNodeContent = { ...nodeContent, ...pojoNodeContent };
        break; // <-- never stops being funny
    }

    return {
      nodeId,
      parentId:
        nodeContent.nodeType === 'FsVirtualRootNode' ? '' : nodeBody.parentId, // root should be empty string
      // parentId: nodeBody.parentId === nodeId ? '' : nodeBody.parentId, // root should be empty string
      nodeContent: pojoNodeContent,
    } as TGraphNode;
  });
};

export { pojoToD3TableData };
