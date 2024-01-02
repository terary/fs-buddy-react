import { FsLogicTreeDeep } from './FsLogicTreeDeep';
import formJson5375703 from '../../../../../test-dev-resources/form-json/5375703.json';
import formJson5469299 from '../../../../../test-dev-resources/form-json/5469299.json';
import webhookJson5375703 from '../../../../../test-dev-resources/webhook-json/5375703.json';
import formJson5487084 from '../../../../../test-dev-resources/form-json/5487084.json';
import formJson5488291 from '../../../../../test-dev-resources/form-json/5488291.json';
import expectSnapshotJson from './FsLogicTreeDeep.snapshot.json';
import { FsLogicBranchNode } from './LogicNodes/FsLogicBranchNode';
import { FsLogicLeafNode } from './LogicNodes/FsLogicLeafNode';
import { TApiFormJson } from '../../../../type.form';
import { FsFormModel } from '../../FsFormModel';
import { transformers } from '../../../../transformers';
import { FsVirtualRootNode } from './LogicNodes/FsVirtualRootNode';
import { TTreePojo } from 'predicate-tree-advanced-poc/dist/src';
import { AbstractLogicNode } from './LogicNodes/AbstractLogicNode';

describe('FsLogicTreeDeep', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  describe('Pojo Smoke test.', () => {
    it('Smoke Test', () => {
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );
      const tree5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      const agTree153051795 = tree5375703.aggregateLogicTree('153051795'); //Conflict with show/hide, panel/field (parent panel)
      const pojo153051795 = agTree153051795.toPojoAt(undefined, false);
      const d3FieldTable153051795 = transformers.pojoToD3TableData(
        agTree153051795.toPojoAt(undefined, false),
        tree5375703
      );

      const agTrees: { [fieldId: string]: FsLogicTreeDeep } = {};
      const pojos: { [fieldId: string]: TTreePojo<AbstractLogicNode> | null } =
        {};
      const d3Mappings: { [fieldId: string]: any } = {};
      tree5469299.getAllFieldIds().forEach((fieldId) => {
        agTrees[fieldId] = tree5469299.aggregateLogicTree(fieldId);

        if (agTrees[fieldId] === null) {
          pojos[fieldId] = null;
          d3Mappings[fieldId] = null;
        } else {
          pojos[fieldId] = agTrees[fieldId].toPojoAt(undefined, false);
          d3Mappings[fieldId] = transformers.pojoToD3TableData(
            pojos[fieldId] as TTreePojo<AbstractLogicNode>,
            tree5469299
          );
        }
      });
      tree5375703.getAllFieldIds().forEach((fieldId) => {
        agTrees[fieldId] = tree5375703.aggregateLogicTree(fieldId);
        if (agTrees[fieldId] === null) {
          pojos[fieldId] = null;
          d3Mappings[fieldId] = null;
        } else {
          pojos[fieldId] = agTrees[fieldId].toPojoAt(undefined, false);
          d3Mappings[fieldId] = transformers.pojoToD3TableData(
            pojos[fieldId] as TTreePojo<AbstractLogicNode>,
            tree5375703
          );
        }
      });

      const actualSnapshotJson = {
        // agTrees,
        pojos,
        d3Mappings,
      };

      expect(actualSnapshotJson).toStrictEqual(expectSnapshotJson);
    });
  });

  describe('.getDependantFieldIds()', () => {
    it('Should be empty array for dependency list of single node tree (new without root node).', () => {
      const tree5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );

      const agTree152297010 = tree5469299.aggregateLogicTree('152297010');
      const pojo = {
        agTree152297010: tree5469299
          .aggregateLogicTree('152297010')
          .toPojoAt(undefined, false), // Mutually Inclusive
        agTree152293116: tree5469299
          .aggregateLogicTree('152293116')
          .toPojoAt(undefined, false), // Mutually Exclusive
        agTree152290546: tree5469299
          .aggregateLogicTree('152290546')
          .toPojoAt(undefined, false), // (B) A->B->C-D->E->A (logic)
        agTree148456742: tree5375703
          .aggregateLogicTree('148456742')
          .toPojoAt(undefined, false), // (B) A->B->C-D->E->A (logic)
        agTree148509470: tree5375703
          .aggregateLogicTree('148509470')
          .toPojoAt(undefined, false), // A (within panel)
      };

      expect(pojo).toStrictEqual(dev_debug_pojo_smoke_test);
    });
  });

  describe('.getParentNodeId()', () => {
    it('Should return nodeId of root, if given rootNodeId (if self == parent then self is root).', () => {
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );
      const agTree152297010 = tree5469299.aggregateLogicTree('152297010');
      expect(
        agTree152297010.getParentNodeId(agTree152297010.rootNodeId)
      ).toStrictEqual(agTree152297010.rootNodeId);
    });
    it('Should return parent node id for child node.', () => {
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );
      const agTree152297010 = tree5469299.aggregateLogicTree('152297010');

      const childrenNodeIds = agTree152297010.getChildrenNodeIdsOf(
        agTree152297010.rootNodeId
      );
      // @ts-ignore
      expect(agTree152297010.getParentNodeId(childrenNodeIds[0])).toStrictEqual(
        agTree152297010.rootNodeId
      );
    });
  });

  describe('.countTotalNodes()', () => {
    it('Should return total nodes in tree.', () => {
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );
      const agTree152297010 = tree5469299.aggregateLogicTree('152297010');
      expect(agTree152297010.countTotalNodes()).toStrictEqual(4);
    });
  });

  describe('.isExistInDependencyChain()', () => {
    it('Should return true if node exists in dependency chain.', () => {
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );

      const fieldModel = tree5469299.getFieldModel('152297010');
      const agTree152297010 = tree5469299.aggregateLogicTree('152297010');
      expect(
        agTree152297010.isExistInDependencyChain(fieldModel)
      ).toStrictEqual(true);
    });
    it('Should return false if node DOES NOT exists in dependency chain.', () => {
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );

      const fieldModel = tree5469299.getFieldModel('151678347'); // switzerland and switzerland has no dependency chain
      const agTree152297010 = tree5469299.aggregateLogicTree('152297010');
      expect(
        agTree152297010.isExistInDependencyChain(fieldModel)
      ).toStrictEqual(false);
    });
  });

  describe('.getStatisticCounts()', () => {
    it('Should return total nodes in tree.', () => {
      const tree5469299 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5469299 as unknown as TApiFormJson)
      );
      const unclassifiedNode = {
        fieldId: '152297010',
        type: 'unclassified',
        note: 'a node that is not a leaf, branch, vRoot, or circular.',
      };
      const agTree152297010 = tree5469299.aggregateLogicTree('152297010');
      agTree152297010.appendChildNodeWithContent(
        agTree152297010.rootNodeId,
        // @ts-ignore - the purpose of the test
        unclassifiedNode
      );
      const statsRecord = agTree152297010.getStatisticCounts();
      expect(statsRecord).toStrictEqual({
        totalNodes: 5,
        totalCircularLogicNodes: 0,
        totalUnclassifiedNodes: 1,
        totalLeafNodes: 2,
        totalBranchNodes: 1,
        totalRootNodes: 1,
      });
    });
  });

  describe('.appendNodeWithContent()', () => {
    it('Should append node to tree.', () => {
      const tree5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const agTree153051795 = tree5375703.aggregateLogicTree('153051795'); //Conflict with show/hide, panel/field (parent panel)

      const nodeContent = {
        nodeType: 'FsLogicLeafNode', // AI generated.  This should be a LeafNode but AI's object seems to work also. Kinda neat
        fieldId: '152297010',
        condition: 'equals',
        option: 'Zero',
      };
      const nodeId = agTree153051795.appendChildNodeWithContent(
        agTree153051795.rootNodeId,
        // @ts-ignore
        nodeContent
      );
      expect(agTree153051795.getChildContentAt(nodeId)).toStrictEqual(
        nodeContent
      );
    });
    it('Should Throw error when appending to invalid parentId.', () => {
      const tree5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const agTree153051795 = tree5375703.aggregateLogicTree('153051795'); //Conflict with show/hide, panel/field (parent panel)

      const nodeContent = {
        nodeType: 'FsLogicLeafNode', // AI generated.  This should be a LeafNode but AI's object seems to work also. Kinda neat
        fieldId: '152297010',
        condition: 'equals',
        option: 'Zero',
      };
      const willThrow = () => {
        const nodeId = agTree153051795.appendChildNodeWithContent(
          '_DOES_NOT_EXIST_',
          // @ts-ignore
          nodeContent
        );
      };
      expect(willThrow).toThrow(
        new Error(
          "parentNodeId does not exists. parentNodeId: '_DOES_NOT_EXIST_'."
        )
      );
    });
    it('Should throw error when MAX_TOTAL_NODES is exceeded.', () => {
      const tree5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const spy = jest
        .spyOn(FsLogicTreeDeep as any, 'MAX_TOTAL_NODES', 'get')
        .mockReturnValue(1);

      const willThrow = () => {
        tree5375703.aggregateLogicTree('153051795');
      };
      expect(willThrow).toThrow(
        new Error(
          "Exceed MAX_TOTAL_NODES. Current node count: '4',  MAX_TOTAL_NODES: '1'."
        )
      );
      spy.mockRestore(); // for some reason, afterAll and jest.config does not work, because it's a static member?
    });
  });
  describe('FsLogicTreeDeep.offFormDeepLogic)', () => {
    it('Should return a new tree with all nodes from Off-Form logic expression.', () => {
      const formModel5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      // const agTree152297010 = formModel5375703.aggregateLogicTree('152297010');

      const agTree = formModel5375703.aggregateOffFormLogicJson(
        // @ts-ignore
        webhookJson5375703.webhooks[0].logic //"Circular Logic"
      );
      expect(agTree?.countTotalNodes()).toStrictEqual(13);
    });
    it("Should return simple tree if the off-form logic has no recursive logic (eg only the field's logic).", () => {
      const formModel5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const agTree = formModel5375703.aggregateOffFormLogicJson(
        // @ts-ignore
        webhookJson5375703.webhooks[1].logic //Swtizerland
      );
      expect(agTree?.countTotalNodes()).toEqual(2);
    });
    it('Should simple tree if only field logic (test coverage).', () => {
      const formModel5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const agTree = formModel5375703.aggregateOffFormLogicJson(
        // @ts-ignore
        webhookJson5375703.webhooks[2].logic //"Two mutually Exclusive Trees (both with circular logic)"
      );
      expect(agTree?.countTotalNodes()).toEqual(19);
    });
    it('Should null if logic is empty.', () => {
      const formModel5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const agTree = formModel5375703.aggregateOffFormLogicJson(
        // @ts-ignore
        webhookJson5375703.webhooks[3].logic //no logic (logic == [])
      );
      expect(agTree).toBeNull();
    });
    it('Should simple tree if only field logic (test coverage).', () => {
      const formModel5375703 = FsFormModel.fromApiFormJson(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const agTree = formModel5375703.aggregateOffFormLogicJson(
        // @ts-ignore
        webhookJson5375703.webhooks[4].logic //"Two Panel With Conflicting Logic"
      );
      expect(agTree?.countTotalNodes()).toEqual(6);
    });
  });
});

const dev_debug_pojo_smoke_test = {
  agTree152297010: {
    '152297010': {
      parentId: '152297010',
      nodeContent: {
        nodeType: 'FsVirtualRootNode',
        fieldId: '152297010',
        conditional: 'all',
      },
    },
    '152297010:0': {
      parentId: '152297010',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '152297010',
        action: 'show',
        conditional: 'all',
      },
    },
    '152297010:0:1': {
      parentId: '152297010:0',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '152293117',
        condition: 'equals',
        option: 'Zero',
      },
    },
    '152297010:0:2': {
      parentId: '152297010:0',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '152293117',
        condition: 'equals',
        option: 'Zero',
      },
    },
  },
  agTree152293116: {
    '152293116': {
      parentId: '152293116',
      nodeContent: {
        nodeType: 'FsVirtualRootNode',
        fieldId: '152293116',
        conditional: 'all',
      },
    },
    '152293116:0': {
      parentId: '152293116',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '152293116',
        action: 'show',
        conditional: 'all',
      },
    },
    '152293116:0:1': {
      parentId: '152293116:0',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '152293117',
        condition: 'equals',
        option: 'Zero',
      },
    },
    '152293116:0:2': {
      parentId: '152293116:0',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '152293117',
        condition: 'equals',
        option: 'One',
      },
    },
  },
  agTree152290546: {
    '152290546': {
      parentId: '152290546',
      nodeContent: {
        nodeType: 'FsVirtualRootNode',
        fieldId: '152290546',
        conditional: 'all',
      },
    },
    '152290546:0': {
      parentId: '152290546',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '152290546',
        action: 'show',
        conditional: 'all',
      },
    },
    '152290546:0:1': {
      parentId: '152290546:0',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '152290547',
        condition: 'equals',
        option: 'OptionA',
      },
    },
    '152290546:0:2': {
      parentId: '152290546:0',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '152290547',
        action: 'show',
        conditional: 'all',
      },
    },
    '152290546:0:2:3': {
      parentId: '152290546:0:2',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '152290548',
        condition: 'equals',
        option: 'OptionA',
      },
    },
    '152290546:0:2:4': {
      parentId: '152290546:0:2',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '152290548',
        action: 'show',
        conditional: 'all',
      },
    },
    '152290546:0:2:4:5': {
      parentId: '152290546:0:2:4',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '152290549',
        condition: 'equals',
        option: 'OptionA',
      },
    },
    '152290546:0:2:4:6': {
      parentId: '152290546:0:2:4',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '152290549',
        action: 'show',
        conditional: 'all',
      },
    },
    '152290546:0:2:4:6:7': {
      parentId: '152290546:0:2:4:6',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '152290545',
        condition: 'equals',
        option: 'OptionA',
      },
    },
  },
  agTree148456742: {
    '148456742': {
      parentId: '148456742',
      nodeContent: {
        nodeType: 'FsVirtualRootNode',
        fieldId: '148456742',
        conditional: 'all',
      },
    },
    '148456742:0': {
      parentId: '148456742',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '148456742',
        action: 'show',
        conditional: 'all',
      },
    },
    '148456742:0:1': {
      parentId: '148456742:0',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148456741',
        condition: 'equals',
        option: 'OptionA',
      },
    },
    '148456742:0:2': {
      parentId: '148456742:0',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '148456741',
        action: 'show',
        conditional: 'all',
      },
    },
    '148456742:0:2:3': {
      parentId: '148456742:0:2',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148456740',
        condition: 'equals',
        option: 'OptionA',
      },
    },
    '148456742:0:2:4': {
      parentId: '148456742:0:2',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '148456740',
        action: 'show',
        conditional: 'all',
      },
    },
    '148456742:0:2:4:5': {
      parentId: '148456742:0:2:4',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148456739',
        condition: 'equals',
        option: 'OptionA',
      },
    },
    '148456742:0:2:4:6': {
      parentId: '148456742:0:2:4',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '148456739',
        action: 'show',
        conditional: 'all',
      },
    },
    '148456742:0:2:4:6:7': {
      parentId: '148456742:0:2:4:6',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148456734',
        condition: 'equals',
        option: 'OptionA',
      },
    },
    '148456742:0:2:4:6:8': {
      parentId: '148456742:0:2:4:6',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '148456734',
        action: 'show',
        conditional: 'all',
      },
    },
    '148456742:0:2:4:6:8:9': {
      parentId: '148456742:0:2:4:6:8',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148456742',
        condition: 'equals',
        option: 'OptionA',
      },
    },
    '148456742:0:2:4:6:8:10': {
      parentId: '148456742:0:2:4:6:8',
      nodeContent: {
        nodeType: 'FsCircularDependencyNode',
        sourceFieldId: '148456734',
        sourceNodeId: '148456742:0',
        targetFieldId: '148456742',
        targetNodeId: '148456742:0:2:4:6:8:10',
        ruleConflict: {
          conditionalA: {
            condition: 'all',
            action: 'show',
          },
          conditionalB: {
            condition: 'all',
            action: 'show',
          },
        },
        dependentChainFieldIds: [
          '148456742',
          '148456741',
          '148456740',
          '148456739',
          '148456734',
        ],
      },
    },
  },
  agTree148509470: {
    '148509470': {
      parentId: '148509470',
      nodeContent: {
        nodeType: 'FsVirtualRootNode',
        fieldId: '148509470',
        conditional: 'all',
      },
    },
    '148509470:0': {
      parentId: '148509470',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '148509470',
        action: 'show',
        conditional: 'all',
      },
    },
    '148509470:0:1': {
      parentId: '148509470:0',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148509478',
        condition: 'equals',
        option: 'True',
      },
    },
    '148509470:0:2': {
      parentId: '148509470:0',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '148509465',
        action: 'show',
        conditional: 'all',
      },
    },
    '148509470:0:2:3': {
      parentId: '148509470:0:2',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148509470',
        condition: 'equals',
        option: 'True',
      },
    },
    '148509470:0:2:4': {
      parentId: '148509470:0:2',
      nodeContent: {
        nodeType: 'FsCircularDependencyNode',
        sourceFieldId: '148509465',
        sourceNodeId: '148509470:0',
        targetFieldId: '148509470',
        targetNodeId: '148509470:0:2:4',
        ruleConflict: {
          conditionalA: {
            condition: 'all',
            action: 'show',
          },
          conditionalB: {
            condition: 'all',
            action: 'show',
          },
        },
        dependentChainFieldIds: ['148509470', '148509465'],
      },
    },
    '148509470:0:2:5': {
      parentId: '148509470:0:2',
      nodeContent: {
        nodeType: 'FsCircularDependencyNode',
        sourceFieldId: '148509465',
        sourceNodeId: '148509470:0:2',
        targetFieldId: '148509465',
        targetNodeId: '148509470:0:2:5',
        ruleConflict: {
          conditionalA: {
            condition: 'all',
            action: 'show',
          },
          conditionalB: {
            condition: 'all',
            action: 'show',
          },
        },
        dependentChainFieldIds: ['148509470', '148509465'],
      },
    },
    '148509470:0:2:6': {
      parentId: '148509470:0:2',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148509476',
        condition: 'equals',
        option: 'True',
      },
    },
    '148509470:0:2:7': {
      parentId: '148509470:0:2',
      nodeContent: {
        nodeType: 'FsLogicBranchNode',
        ownerFieldId: '148509476',
        action: 'show',
        conditional: 'all',
      },
    },
    '148509470:0:2:7:8': {
      parentId: '148509470:0:2:7',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148509477',
        condition: 'equals',
        option: 'True',
      },
    },
    '148509470:0:2:7:9': {
      parentId: '148509470:0:2:7',
      nodeContent: {
        nodeType: 'FsCircularDependencyNode',
        sourceFieldId: '148509476',
        sourceNodeId: '148509470:0:2',
        targetFieldId: '148509465',
        targetNodeId: '148509470:0:2:7:9',
        ruleConflict: {
          conditionalA: {
            condition: 'all',
            action: 'show',
          },
          conditionalB: {
            condition: 'all',
            action: 'show',
          },
        },
        dependentChainFieldIds: ['148509470', '148509465', '148509476'],
      },
    },
    '148509470:0:2:7:10': {
      parentId: '148509470:0:2:7',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148509474',
        condition: 'equals',
        option: 'True',
      },
    },
    '148509470:0:2:7:11': {
      parentId: '148509470:0:2:7',
      nodeContent: {
        nodeType: 'FsCircularDependencyNode',
        sourceFieldId: '148509476',
        sourceNodeId: '148509470:0:2',
        targetFieldId: '148509465',
        targetNodeId: '148509470:0:2:7:11',
        ruleConflict: {
          conditionalA: {
            condition: 'all',
            action: 'show',
          },
          conditionalB: {
            condition: 'all',
            action: 'show',
          },
        },
        dependentChainFieldIds: ['148509470', '148509465', '148509476'],
      },
    },
    '148509470:0:2:12': {
      parentId: '148509470:0:2',
      nodeContent: {
        nodeType: 'FsCircularDependencyNode',
        sourceFieldId: '148509476',
        sourceNodeId: '148509470:0:2',
        targetFieldId: '148509465',
        targetNodeId: '148509470:0:2:12',
        ruleConflict: {
          conditionalA: {
            condition: 'all',
            action: 'show',
          },
          conditionalB: {
            condition: 'all',
            action: 'show',
          },
        },
        dependentChainFieldIds: ['148509470', '148509465', '148509476'],
      },
    },
    '148509470:0:2:13': {
      parentId: '148509470:0:2',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '151678347',
        condition: 'equals',
        option: 'Neutral',
      },
    },
    '148509470:0:14': {
      parentId: '148509470:0',
      nodeContent: {
        nodeType: 'FsLogicLeafNode',
        fieldId: '148509475',
        condition: 'equals',
        option: 'True',
      },
    },
    '148509470:0:15': {
      parentId: '148509470:0',
      nodeContent: {
        nodeType: 'FsCircularDependencyNode',
        sourceFieldId: '148509476',
        sourceNodeId: '148509470:0:2',
        targetFieldId: '148509465',
        targetNodeId: '148509470:0:15',
        ruleConflict: {
          conditionalA: {
            condition: 'all',
            action: 'show',
          },
          conditionalB: {
            condition: 'all',
            action: 'show',
          },
        },
        dependentChainFieldIds: ['148509470', '148509465', '148509476'],
      },
    },
    '148509470:16': {
      parentId: '148509470',
      nodeContent: {
        nodeType: 'FsCircularDependencyNode',
        sourceFieldId: '148509476',
        sourceNodeId: '148509470:0:2',
        targetFieldId: '148509465',
        targetNodeId: '148509470:16',
        ruleConflict: {
          conditionalA: {
            condition: 'all',
            action: 'show',
          },
          conditionalB: {
            condition: 'all',
            action: 'show',
          },
        },
        dependentChainFieldIds: ['148509470', '148509465', '148509476'],
      },
    },
  },
};
