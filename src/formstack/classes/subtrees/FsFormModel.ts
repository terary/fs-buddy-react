import { AbstractExpressionTree } from 'predicate-tree-advanced-poc/dist/src';

import { FsFieldModel } from './trees/FsFieldModel';

import { FsFieldVisibilityLinkNode, FsFormRootNode } from './trees/nodes';
import type {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsJunctionOperators,
  TFsLeafOperators,
  TSimpleDictionary,
  TTreeFieldNode,
} from './types';

import { FsLogicLeafNode, FsLogicTreeDeep } from './trees/FsLogicTreeDeep';

import { TStatusRecord, TUiEvaluationObject } from '../Evaluator/type';
import { TApiForm, TSubmissionJson } from '../../type.form';
import { IEValuator } from '../Evaluator/IEvaluator';
import { TFsFieldAny } from '../../type.field';
import { keyIn } from '../../../common/functions';
import { FsVirtualRootNode } from './trees/FsLogicTreeDeep/LogicNodes/FsVirtualRootNode';
import { FsFieldLogicModel } from './trees/FsFieldLogicModel';
import { transformers } from '../../transformers';

// interface ILogicCheck {
//   fieldId: string;
//   condition: TFsLeafOperators;
//   option: string;
// }

class FsFormModel extends AbstractExpressionTree<
  TTreeFieldNode | FsFormRootNode
> {
  private _dependantFieldIds: string[] = []; // is this really used?
  private _fieldIdNodeMap: { [fieldId: string]: FsFieldModel } = {};
  #deepLogicTreesFieldIdMap!: TSimpleDictionary<FsLogicTreeDeep | null>; // = {};

  createSubtreeAt(targetNodeId: string): FsFormModel {
    const subtree = new FsFormModel('_subtree_');

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetNodeId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TTreeFieldNode | FsFormRootNode>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree;
  }

  getDeepLogicTreeByFieldId(fieldId: string): FsLogicTreeDeep | null {
    if (this.#deepLogicTreesFieldIdMap === undefined) {
      this.#deepLogicTreesFieldIdMap = (this.getAllFieldIds() || []).reduce(
        (p, c, i, a) => {
          const fieldModel = this.getFieldById(c);
          p[c] = this.getExtendedTree(fieldModel);
          return p;
        },
        {} as TSimpleDictionary<FsLogicTreeDeep | null>
      );
    }
    return this.#deepLogicTreesFieldIdMap[fieldId];
  }

  getFormFieldsCount() {
    return this.getAllFieldIds().length;
  }

  getAllFieldIds() {
    return Object.keys(this._fieldIdNodeMap);
  }

  private getFieldById(fieldId: string): FsFieldModel {
    return this._fieldIdNodeMap[fieldId];
  }

  // Looks like this generic is not being used - git rid of it
  private getExtendedTree<T extends FsLogicTreeDeep = FsLogicTreeDeep>(
    field: FsFieldModel
  ): FsLogicTreeDeep | null {
    return FsLogicTreeDeep.fromFormModel(field.fieldId, this);
  }

  aggregateLogicTree(fieldId: string): FsLogicTreeDeep {
    const field = this.getFieldModel(fieldId) as FsFieldModel;

    // @ts-ignore - possible null
    return this.getExtendedTree(field);
  }

  private _make_new_logic_tree(
    //    fieldId: string, // FsFieldModel,
    check: TFsFieldLogicCheckLeaf,
    conditional: TFsJunctionOperators
  ) {
    const { fieldId, condition, option } = check;
    const tree = new FsLogicTreeDeep(
      fieldId,
      new FsVirtualRootNode(fieldId, conditional)
    );
    tree.appendChildNodeWithContent(
      tree.rootFieldId, // I think this should be deepTreeParentNodeId
      new FsLogicLeafNode(fieldId, condition, option)
    );

    FsLogicTreeDeep.offFormDeepLogic(
      fieldId,
      this, // model
      tree,
      tree.rootFieldId
    );

    // const firstNode =
    //   this.aggregateLogicTree(field.fieldId) ||
    //   new FsLogicLeafNode(check.fieldId, check.condition, check.option);
    // tree.appendChildNodeWithContent(
    //   tree.rootNodeId,
    //   new FsLogicLeafNode(check.fieldId, check.condition, check.option)
    // );
    return tree;
  }

  aggregateOffFormLogicJson(
    logic: TFsFieldLogicJunctionJson
  ): FsLogicTreeDeep | null {
    const { action, conditional, checks } =
      transformers.notificationEmailLogicJson(logic);
    if (!Array.isArray(checks) || checks.length == 0) {
      // is this a leaf?
      // is it the case there will be branches without leaves? (yes, but there shouldn't be.)
      return null;
    }
    const firstCheck = checks.pop();
    // if (!firstCheck) {
    //   return null;
    // }
    // const fModel = this.getFieldModel(firstCheck?.fieldId || '_FIELD_ID_');
    const offFormLogicTree = this._make_new_logic_tree(
      // @ts-ignore - possible null
      firstCheck, // ? fModel as FsFieldModel,
      // @ts-ignore, this isn't being used any more
      //      null, //firstCheck as TFsFieldLogicCheckLeaf,
      conditional
    );

    // const offFormLogicTree =
    //   this.aggregateLogicTree(firstCheck?.fieldId || '_FIELD_ID_') ||
    //   this._make_new_logic_tree(
    //     fModel as FsFieldModel,
    //     firstCheck as TFsFieldLogicCheckLeaf,
    //     conditional
    //   );

    (checks || []).forEach((check: any) => {
      FsLogicTreeDeep.offFormDeepLogic(
        check.field,
        this, // model
        offFormLogicTree,
        offFormLogicTree.rootFieldId
      );
      // append tree
    });

    return offFormLogicTree;
  }
  // TFsFieldLogicJunctionJson

  getAllLogicStatusMessages(): TStatusRecord[] {
    const allFieldIds = Object.keys(this._fieldIdNodeMap);
    // const allFieldIds = ["152290546", "152290563"]; // *tmc* debug

    const statusMessages: TStatusRecord[] = [];
    // does _dependantFieldIds ever get used?

    allFieldIds.forEach((fieldId) => {
      const agTree = this.aggregateLogicTree(fieldId);
      if (agTree instanceof FsLogicTreeDeep) {
        statusMessages.push(...agTree.getStatusMessage());
      }
    });
    return statusMessages.filter(
      (statusMessage) => statusMessage.severity !== 'debug' // filter probably shouldn't be here
    );
  }

  getFieldModelOrThrow(fieldId: string): FsFieldModel {
    const fieldModel = this.getFieldModel(fieldId);
    if (fieldModel === undefined) {
      throw new Error(`Failed to get field model by id: '${fieldId}'`);
    }

    return fieldModel;
  }

  getFieldModel(fieldId: string): FsFieldModel | undefined {
    // I wounder if a look-up table wouldn't be better
    //  also you're filtering after map, if possible the other order would be preferred
    return this._fieldIdNodeMap[fieldId];
  }

  getFieldIdsWithLogicError(): string[] {
    const allFieldIds = Object.keys(this._fieldIdNodeMap);
    return allFieldIds.filter((fieldId) => {
      const agTree = this.aggregateLogicTree(fieldId);
      if (agTree) {
        return agTree.getLogicErrorNodes().length > 0;
      }
      // return false; // necessary?
    });
  }

  getFieldIdsWithCircularLogic(): string[] {
    const allFieldIds = Object.keys(this._fieldIdNodeMap);
    return allFieldIds.filter((fieldId) => {
      const agTree = this.getDeepLogicTreeByFieldId(fieldId);
      if (agTree) {
        return agTree.getCircularLogicNodes().length > 0;
      }
    });
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    return Object.entries(this._fieldIdNodeMap).map(([fieldId, field]) => {
      return field.evaluateWithValues(values);
    }) as T;
  }

  x_getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }

  getFieldsBySection(section: FsFieldModel) {
    const childrenFieldNodes = this.getChildrenContentOf(
      this.rootNodeId
    ) as TTreeFieldNode[];

    const sectionChildren = childrenFieldNodes
      .filter((fieldNode) => {
        const { fieldId, field } = fieldNode;

        const visibilityNode = field.getVisibilityNode();

        return Object.is(visibilityNode?.parentNode, section);
      })
      .map((fieldNode) => fieldNode.field);
    return sectionChildren;
  }

  private getEvaluatorByFieldId(fieldId: string): IEValuator {
    const treeField = this.getFieldById(fieldId);
    return treeField.getSubmissionEvaluator();
  }

  getUiPopulateObject(
    apiSubmissionJson: TSubmissionJson
  ): TUiEvaluationObject[] {
    if (
      !keyIn('data', apiSubmissionJson) ||
      !Array.isArray(apiSubmissionJson.data)
    ) {
      console.log('Did not understand apiSubmissionJson');
      console.log({ apiSubmissionJson });
      return [];
    }

    const mappedSubmissionData = apiSubmissionJson.data.reduce(
      (prev: any, cur: any) => {
        prev[cur.field] = cur.value;
        return prev;
      },
      {}
    );

    const submissionUiDataItems: TUiEvaluationObject[] = this.getAllFieldIds()
      .map((fieldId) => {
        const evaluator = this.getEvaluatorByFieldId(fieldId);
        if (fieldId === '156707745') {
          console.log({
            uiPopulateObjects: evaluator.getUiPopulateObjects(
              mappedSubmissionData[fieldId]
            ),
            mappedSubmissionData: mappedSubmissionData[fieldId],
            fieldId,
            evaluator: evaluator,
          });
        }
        return evaluator.getUiPopulateObjects(mappedSubmissionData[fieldId]);
      })
      .reduce((prev: TUiEvaluationObject[], cur: TUiEvaluationObject[]) => {
        prev.push(...cur);
        return prev;
      }, []);

    const regEx = new RegExp(/156707745/);
    const messagesFor156707745 = submissionUiDataItems.filter((fieldData) => {
      const { statusMessages = [], fieldType, uiid, fieldId } = fieldData;
      return regEx.test(fieldId || '') || regEx.test(uiid || '');
    });

    console.log({
      getUiPopulateObject: { messagesFor156707745, submissionUiDataItems },
    });
    return submissionUiDataItems;
  }

  static fromApiFormJson(
    formJson: TApiForm,
    formId = '_FORM_ID_'
  ): FsFormModel {
    const fieldsJson = formJson.fields;

    const tree = new FsFormModel(formId, new FsFormRootNode(formId));

    (fieldsJson || []).forEach((fieldJson) => {
      const field = FsFieldModel.fromFieldJson(fieldJson);

      tree.appendChildNodeWithContent(tree.rootNodeId, {
        fieldId: field.fieldId,
        field,
      });
    });

    tree.getChildrenContentOf(tree.rootNodeId).forEach((childContent) => {
      const { fieldId, field } = childContent as TTreeFieldNode;
      tree._fieldIdNodeMap[fieldId] = field;
    });

    const childrenNodeContent = tree.getChildrenContentOf(
      tree.rootNodeId
    ) as TTreeFieldNode[];

    const sortedNodes = childrenNodeContent.sort(sortBySortProperty);

    let currentSection: FsFieldModel | null = null;
    for (let childNode of sortedNodes) {
      // order is necessary
      const { fieldId, field } = childNode;
      const { type: fieldType } = field?.fieldJson as TFsFieldAny;

      if (fieldType && fieldType === 'section') {
        currentSection = field;
      } else if (currentSection instanceof FsFieldModel) {
        const isUltimatelyVisible = (values: {
          [fieldId: string]: any;
        }): boolean => {
          // @ts-ignore - section may be null. This depends on 'evaluateWithValues' which is not complete
          return currentSection.evaluateWithValues(values) || false;
        };

        // because sections can't be in sections
        field.appendChildNodeWithContent(
          field.rootNodeId,
          new FsFieldVisibilityLinkNode(isUltimatelyVisible, currentSection)
        );
      }
    }

    return tree;
  }
}
export { FsFormModel };

const sortBySortProperty = (
  fieldNodeA: TTreeFieldNode,
  fieldNodeB: TTreeFieldNode
) => {
  const fieldAJson = fieldNodeA.field.fieldJson as TFsFieldAny;
  const fieldBJson = fieldNodeB.field.fieldJson as TFsFieldAny;

  if (fieldAJson.sort === undefined || fieldBJson.sort === undefined) {
    return 1;
  }
  const sortA = parseInt(fieldAJson.sort + '');
  const sortB = parseInt(fieldBJson.sort + '');

  if (sortA > sortB) {
    return 1;
  }
  if (sortA < sortB) {
    return -1;
  }
  return 0;
};
