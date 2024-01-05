/* cspell:ignore unnegated */

import { FsFieldLogicModel } from './FsFieldLogicModel';
import { AbstractFsTreeGeneric } from './AbstractFsTreeGeneric';
import { TFsFieldAnyJson } from '../../types';
import formJson5487084 from '../../../../test-dev-resources/form-json/5487084.json';
import { testables } from './FsFieldLogicModel';
import fifthDegreeBadCircuitFormJson from '../../../../test-dev-resources/form-json/5375703.json';
import { TTreePojo } from 'predicate-tree-advanced-poc/dist/src';
import {
  TFsFieldLogicJunction,
  TFsFieldLogicNode,
  TFsJunctionOperators,
  TSimpleDictionary,
} from '../types';

const formJson5487084FieldsById = formJson5487084.fields.reduce(
  (p, c, i, a) => {
    p[c.id] = c as unknown as TFsFieldAnyJson; // transformers.fieldJson(c as unknown as TFsFieldAnyJson);
    return p;
  },
  {} as TSimpleDictionary<TFsFieldAnyJson>
);

describe('FsFieldLogicModel', () => {
  describe('testables', () => {
    describe('.andReducer()', () => {
      it('Should return true if all values are true.', () => {
        const values = [true, true, true];
        expect(values.reduce(testables.andReducer, true)).toStrictEqual(true);
      });
      it('Should return false if any values are false.', () => {
        const values = [true, false, true];
        expect(values.reduce(testables.andReducer, true)).toStrictEqual(false);
      });
    });
    describe('.orReducer()', () => {
      it('Should return false if all values are false.', () => {
        const values = [false, false, false];
        expect(values.reduce(testables.orReducer, false)).toStrictEqual(false);
      });
      it('Should return true if any values are true.', () => {
        const values = [false, true, false];
        expect(values.reduce(testables.orReducer, false)).toStrictEqual(true);
      });
    });
  });
  describe('.defaultJunction()', () => {
    it('Should return "all" by default.', () => {
      class TestClass extends FsFieldLogicModel {
        getDefaultJunction() {
          return this.defaultJunction();
        }
      }
      const fieldLogicModel = FsFieldLogicModel.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      ) as TestClass;
      const tClass = new TestClass();
      Object.setPrototypeOf(fieldLogicModel, tClass);

      expect(fieldLogicModel.getDefaultJunction()).toStrictEqual({
        conditional: 'all',
        fieldJson: {},
      });
    });
  });
  describe('.createSubtreeAt()', () => {
    it('Should create a subtree at a given node.', () => {
      const tree = FsFieldLogicModel.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      );
      const subtree = tree.createSubtreeAt(tree.rootNodeId);
      expect(subtree).toBeInstanceOf(FsFieldLogicModel);
      // expect(subtree.rootNodeId).not.toEqual(tree.rootNodeId);
      // expect(subtree.rootNodeId).not.toEqual(tree.rootNodeId);
    });
  });
  describe('.toPojoAt()', () => {
    let tree: FsFieldLogicModel;
    beforeEach(() => {
      tree = FsFieldLogicModel.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      );
    });
    it('Should produce Pojo to sufficient to serial tree.', () => {
      const pojo = tree.toPojoAt(undefined, false);
      expect(JSON.stringify(pojo)).toStrictEqual(
        JSON.stringify(test_field_pojo)
      );
    });
  });
  describe('.fromPojo()<FsFieldLogicModel, TFsFieldLogicNode>', () => {
    it('Should inflate a tree from Pojo.', () => {
      const tree = FsFieldLogicModel.fromPojo<
        FsFieldLogicModel,
        TFsFieldLogicNode
      >(test_field_pojo as unknown as TTreePojo<TFsFieldLogicNode>);
      const rootBranch = tree.getChildContentAt(
        tree.rootNodeId
      ) as TFsFieldLogicJunction<TFsJunctionOperators>;
      expect(tree).toBeInstanceOf(FsFieldLogicModel);
      expect(rootBranch.action).toStrictEqual('show');
      expect(rootBranch.conditional).toStrictEqual('all');
      const children = tree.getChildrenContentOf(tree.rootNodeId);
      expect(children.length).toEqual(4);
    });
    it('Should be able to create field from json, convert to pojo, and re-recreate from pojo', () => {
      // there is an issue with 'checks' on root node.  They're becoming objects {1:{...}, 2:{...}}
      // When they should be array.
      const fieldIds = {
        show_if_switzerland_is_neutral: '153055020',
        show_if_switzerland_is_not_neutral: '153055033',
        hide_if_switzerland_is_neutral: '153055011',
        hide_if_switzerland_is_not_neutral: '153055021',
        hide_if_switzerland_is_neutral_conflict_with_panel: '153055042',
        show_if_switzerland_is_not_neutral_and_is_not_neutral_conflict:
          '153058950',
      };

      const ary = [{ label: 'one' }, { label: 'two' }];
      const treeFromJson = FsFieldLogicModel.fromFieldJson(
        formJson5487084FieldsById[
          fieldIds
            .show_if_switzerland_is_not_neutral_and_is_not_neutral_conflict
        ]
      );

      const treeFromPojo = FsFieldLogicModel.fromPojo<
        FsFieldLogicModel,
        TFsFieldLogicNode
      >(treeFromJson.toPojoAt(undefined, false));

      //
      const pojo = treeFromPojo.toPojoAt(undefined, false);
      expect(JSON.stringify(pojo)).toStrictEqual(
        JSON.stringify(form5487084_expectedPojo['153058950'])
      );
    });
    it('Should handle single child branches', () => {
      // there is an issue with 'checks' on root node.  They're becoming objects {1:{...}, 2:{...}}
      // When they should be array.
      const fieldIds = {
        show_if_switzerland_is_neutral: '153055020',
        show_if_switzerland_is_not_neutral: '153055033',
        hide_if_switzerland_is_neutral: '153055011',
        hide_if_switzerland_is_not_neutral: '153055021',
        hide_if_switzerland_is_neutral_conflict_with_panel: '153055042',
        show_if_switzerland_is_not_neutral_and_is_not_neutral_conflict:
          '153058950',
      };

      const ary = [{ label: 'one' }, { label: 'two' }];
      const treeFromJson = FsFieldLogicModel.fromFieldJson(
        formJson5487084FieldsById[fieldIds.hide_if_switzerland_is_neutral]
      );

      const treeFromPojo = FsFieldLogicModel.fromPojo<
        FsFieldLogicModel,
        TFsFieldLogicNode
      >(treeFromJson.toPojoAt(undefined, false));

      const pojo = treeFromPojo.toPojoAt(undefined, false);
      expect(JSON.stringify(pojo)).toStrictEqual(
        JSON.stringify(form5487084_expectedPojo['153055011'])
      );
    });
  });
  describe('.clone()', () => {
    it('Should create carbon copy.  The contents are not references to original content.', () => {
      const tree = FsFieldLogicModel.fromPojo<
        FsFieldLogicModel,
        TFsFieldLogicNode
      >(
        test_field_pojo as unknown as TTreePojo<TFsFieldLogicNode>
      ) as FsFieldLogicModel;

      const clone = tree.cloneAt();
      const clone2 = clone.cloneAt();

      expect(clone.toPojoAt(undefined, false)).toStrictEqual(
        tree.toPojoAt(undefined, false)
      );
      expect(clone2.toPojoAt(undefined, false)).toStrictEqual(
        tree.toPojoAt(undefined, false)
      );

      expect(
        JSON.stringify(clone.getChildContentAt(clone.rootNodeId))
      ).toStrictEqual(JSON.stringify(tree.getChildContentAt(tree.rootNodeId)));

      expect(clone).not.toBe(tree);
      expect(clone.getChildContentAt(clone.rootNodeId)).not.toBe(
        tree.getChildContentAt(tree.rootNodeId)
      );
      expect(tree.getChildContentAt(tree.rootNodeId)).toBe(
        tree.getChildContentAt(tree.rootNodeId)
      );
      expect(clone).toBeInstanceOf(FsFieldLogicModel);
      expect(
        JSON.stringify(tree.getChildrenContentOf(tree.rootNodeId))
      ).toStrictEqual(
        JSON.stringify(clone.getChildrenContentOf(clone.rootNodeId))
      );
    });
  });
  describe('.negate()', () => {
    it.skip('Negated clone was moved to FsLogicTreeDeepInternal', () => {});
    // it("Should negate a tree", () => {
    //   const tree = FsFieldLogicModel.fromFieldJson(
    //     TEST_JSON_FIELD as TFsFieldAnyJson
    //   );
    //   const negatedClone = tree.getNegatedClone();
    //   const unnegatedClone = negatedClone.getNegatedClone();
    //   expect(unnegatedClone.toPojoAt(undefined, false)).toStrictEqual(
    //     tree.toPojoAt(undefined, false)
    //   );
    //   const parentNodeContent = negatedClone.getChildContentAtOrThrow(
    //     negatedClone.rootNodeId
    //   ) as TFsFieldLogicJunction<TFsJunctionOperators>;
    //   expect(parentNodeContent.conditional).toEqual("any");
    //   const children = negatedClone.getChildrenContentOf(
    //     negatedClone.rootNodeId
    //   ) as TFsFieldLogicCheckLeaf[];
    //   const childrenOperators = children.map((child) => child.condition);
    //   expect(childrenOperators).toStrictEqual([
    //     "notequals",
    //     "notequals",
    //     "notequals",
    //     "notequals",
    //   ]);
    // });
    // it("Should be symmetric operation", () => {
    //   const tree = FsFieldLogicModel.fromPojo(
    //     test_field_pojo as unknown as TTreePojo<TFsFieldLogicNode>
    //   ) as FsFieldLogicModel;
    //   const negatedClone = tree.getNegatedClone();
    //   const unnegatedClone = negatedClone.getNegatedClone();
    //   expect(unnegatedClone.toPojoAt(undefined, false)).toStrictEqual(
    //     tree.toPojoAt(undefined, false)
    //   );
    //   const parentNodeContent = negatedClone.getChildContentAtOrThrow(
    //     negatedClone.rootNodeId
    //   ) as TFsFieldLogicJunction<TFsJunctionOperators>;
    //   expect(parentNodeContent.conditional).toEqual("any");
    //   const children = negatedClone.getChildrenContentOf(
    //     negatedClone.rootNodeId
    //   ) as TFsFieldLogicCheckLeaf[];
    //   const childrenOperators = children.map((child) => child.condition);
    //   expect(childrenOperators).toStrictEqual([
    //     "notequals",
    //     "notequals",
    //     "notequals",
    //     "notequals",
    //   ]);
    // });
  });
  describe('Creation', () => {
    it('Should be awesome', () => {
      // const tree = new FsFieldLogicModel("_root_seed_");
      const tree = FsFieldLogicModel.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      );
      expect(tree).toBeInstanceOf(AbstractFsTreeGeneric);

      // fieldLogic can/should have fieldId, maybe modified? "fieldId-logic"?
      // expect(tree.fieldId).toEqual("147462596");

      expect(tree.fieldJson).toStrictEqual(
        (TEST_JSON_FIELD as TFsFieldAnyJson).logic
      );
      expect(tree.getDependantFieldIds().sort()).toStrictEqual(
        ['147462595', '147462597', '147462598', '147462600'].sort()
      );
    });
  });
  describe('.fieldJson', () => {
    let tree: FsFieldLogicModel;
    beforeEach(() => {
      tree = FsFieldLogicModel.fromFieldJson(
        TEST_JSON_FIELD as TFsFieldAnyJson
      );
    });

    it('Should be segment of the original json', () => {
      expect(tree.fieldJson).toStrictEqual(TEST_JSON_FIELD.logic);

      const childrenContent = tree.getChildrenContentOf(tree.rootNodeId);
      // maybe should sort this?
      expect(childrenContent).toStrictEqual([
        {
          fieldId: '147462595',
          fieldJson: {
            field: '147462595',
            condition: 'equals',
            option: 'True',
          },
          condition: 'equals',
          option: 'True',
        },
        {
          fieldId: '147462598',
          fieldJson: {
            field: 147462598,
            condition: 'equals',
            option: 'True',
          },
          condition: 'equals',
          option: 'True',
        },
        {
          fieldId: '147462600',
          fieldJson: {
            field: 147462600,
            condition: 'equals',
            option: 'True',
          },
          condition: 'equals',
          option: 'True',
        },
        {
          fieldId: '147462597',
          fieldJson: {
            field: 147462597,
            condition: 'equals',
            option: 'True',
          },
          condition: 'equals',
          option: 'True',
        },
      ]);
    });
  });

  describe('Typical Use-case', () => {
    it('Should create interdependencies.', () => {
      const fields =
        fifthDegreeBadCircuitFormJson.fields as unknown as TFsFieldAnyJson[];
      const logicTrees = fields
        .map((fieldJson) => {
          if (fieldJson.logic) {
            return {
              [fieldJson.id || '_FIELD_ID']:
                FsFieldLogicModel.fromFieldJson(fieldJson),
            };
          }
        })
        .filter((field) => field); // removed the undefined
    });
  });
});

//  "calculation":"[148149774] + [148149776] * 5"
const TEST_JSON_FIELD = {
  id: '147462596',
  label: '',
  hide_label: '0',
  description: '',
  name: '',
  type: 'richtext',
  options: '',
  required: '0',
  uniq: '0',
  hidden: '0',
  readonly: '0',
  colspan: '1',
  sort: '0',
  logic: {
    action: 'show',
    conditional: 'all',
    checks: [
      {
        field: '147462595',
        condition: 'equals',
        option: 'True',
      },
      {
        field: 147462598,
        condition: 'equals',
        option: 'True',
      },
      {
        field: 147462600,
        condition: 'equals',
        option: 'True',
      },
      {
        field: 147462597,
        condition: 'equals',
        option: 'True',
      },
    ],
  },
  calculation: '[148149774] + [148149776] * 5',
  workflow_access: 'write',
  default: '',
  section_text: '<p>The check boxes prevent this from showing.</p>',
  text_editor: 'wysiwyg',
} as unknown as TFsFieldAnyJson;

const TEST_JSON_FIELD_OR = {
  id: '147462596',
  label: '',
  hide_label: '0',
  description: '',
  name: '',
  type: 'richtext',
  options: '',
  required: '0',
  uniq: '0',
  hidden: '0',
  readonly: '0',
  colspan: '1',
  sort: '0',
  logic: {
    action: 'show',
    conditional: 'any',
    checks: [
      {
        field: '147462595',
        condition: 'equals',
        option: 'True',
      },
      {
        field: 147462598,
        condition: 'equals',
        option: 'True',
      },
      {
        field: 147462600,
        condition: 'equals',
        option: 'True',
      },
      {
        field: 147462597,
        condition: 'equals',
        option: 'True',
      },
    ],
  },
  calculation: '[148149774] + [148149776] * 5',
  workflow_access: 'write',
  default: '',
  section_text: '<p>The check boxes prevent this from showing.</p>',
  text_editor: 'wysiwyg',
} as unknown;

const test_field_pojo = {
  '147462596': {
    parentId: '147462596',
    nodeContent: {
      fieldId: '147462596',
      conditional: 'all',
      action: 'show',
      logicJson: {
        action: 'show',
        conditional: 'all',
        checks: [
          {
            field: '147462595',
            condition: 'equals',
            option: 'True',
          },
          {
            field: 147462598,
            condition: 'equals',
            option: 'True',
          },
          {
            field: 147462600,
            condition: 'equals',
            option: 'True',
          },
          {
            field: 147462597,
            condition: 'equals',
            option: 'True',
          },
        ],
      },
      checks: [
        {
          field: '147462595',
          condition: 'equals',
          option: 'True',
        },
        {
          field: 147462598,
          condition: 'equals',
          option: 'True',
        },
        {
          field: 147462600,
          condition: 'equals',
          option: 'True',
        },
        {
          field: 147462597,
          condition: 'equals',
          option: 'True',
        },
      ],
    },
  },
  '147462596:0': {
    parentId: '147462596',
    nodeContent: {
      fieldId: '147462595',
      fieldJson: {
        field: '147462595',
        condition: 'equals',
        option: 'True',
      },
      condition: 'equals',
      option: 'True',
    },
  },
  '147462596:1': {
    parentId: '147462596',
    nodeContent: {
      fieldId: '147462598',
      fieldJson: {
        field: 147462598,
        condition: 'equals',
        option: 'True',
      },
      condition: 'equals',
      option: 'True',
    },
  },
  '147462596:2': {
    parentId: '147462596',
    nodeContent: {
      fieldId: '147462600',
      fieldJson: {
        field: 147462600,
        condition: 'equals',
        option: 'True',
      },
      condition: 'equals',
      option: 'True',
    },
  },
  '147462596:3': {
    parentId: '147462596',
    nodeContent: {
      fieldId: '147462597',
      fieldJson: {
        field: 147462597,
        condition: 'equals',
        option: 'True',
      },
      condition: 'equals',
      option: 'True',
    },
  },
};

const form5487084_expectedPojo = {
  '153058950': {
    '153058950': {
      parentId: '153058950',
      nodeContent: {
        fieldId: '153058950',
        conditional: 'all',
        action: 'show',
        logicJson: {
          action: 'show',
          conditional: 'all',
          checks: [
            {
              field: '153055010',
              condition: 'notequals',
              option: 'Neutral',
            },
            {
              field: '153055010',
              condition: 'equals',
              option: 'Neutral',
            },
          ],
        },
        checks: [
          {
            field: '153055010',
            condition: 'notequals',
            option: 'Neutral',
          },
          {
            field: '153055010',
            condition: 'equals',
            option: 'Neutral',
          },
        ],
      },
    },
    '153058950:0': {
      parentId: '153058950',
      nodeContent: {
        fieldId: '153055010',
        fieldJson: {
          field: '153055010',
          condition: 'notequals',
          option: 'Neutral',
        },
        condition: 'notequals',
        option: 'Neutral',
      },
    },
    '153058950:1': {
      parentId: '153058950',
      nodeContent: {
        fieldId: '153055010',
        fieldJson: {
          field: '153055010',
          condition: 'equals',
          option: 'Neutral',
        },
        condition: 'equals',
        option: 'Neutral',
      },
    },
  },
  '153055011': {
    '153055011': {
      parentId: '153055011',
      nodeContent: {
        fieldId: '153055011',
        conditional: 'all',
        action: 'hide',
        logicJson: {
          action: 'hide',
          conditional: 'all',
          checks: [
            {
              field: '153055010',
              condition: 'equals',
              option: 'Neutral',
            },
          ],
        },
        checks: [
          {
            field: '153055010',
            condition: 'equals',
            option: 'Neutral',
          },
        ],
      },
    },
    '153055011:0': {
      parentId: '153055011',
      nodeContent: {
        fieldId: '153055010',
        fieldJson: {
          field: '153055010',
          condition: 'equals',
          option: 'Neutral',
        },
        condition: 'equals',
        option: 'Neutral',
      },
    },
  },
};
