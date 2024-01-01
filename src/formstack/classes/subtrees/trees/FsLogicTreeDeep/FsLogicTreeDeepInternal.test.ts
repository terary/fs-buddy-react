import { FsLogicTreeDeepInternal } from './FsLogicTreeDeepInternal';
import formJson5375703 from '../../../../../test-dev-resources/form-json/5375703.json';
import formJson5469299 from '../../../../../test-dev-resources/form-json/5469299.json';
import { FsLogicBranchNode } from './LogicNodes/FsLogicBranchNode';
import { FsLogicLeafNode } from './LogicNodes/FsLogicLeafNode';
import { FsFormModel } from '../../FsFormModel';
import { TApiForm, TApiFormJson, transformers } from '../../../..';
// spyOn(FsLogicTreeDeepInternal.prototype, 'appendChildNodeWithContent').and.callThrough();
// spyOn<any>(FsLogicTreeDeepInternal.prototype, 'appendFieldIdNode').and.callThrough();
/// spyOn(FsLogicTreeDeepInternal.prototype, 'getDependantFieldIds').and.callThrough();

describe('FsLogicTreeDeepInternal', () => {
  describe('.getDependantFieldIds()', () => {
    it('Should be empty array for dependency list of single node tree (new without root node).', () => {
      const tree = new FsLogicTreeDeepInternal('root');
      expect(tree.getDependantFieldIds()).toStrictEqual([]);
    });
    it('Should be empty array for dependency list of single node tree (new with root node).', () => {
      const b = new FsLogicBranchNode('fieldId', '$not', 'Hide', [], {});
      const tree = new FsLogicTreeDeepInternal('root', b);

      expect(tree.getDependantFieldIds()).toStrictEqual([]);
    });
    it('Should be empty array for dependency list of single node tree (new with root node).', () => {
      const b = new FsLogicBranchNode('fieldId', '$not', 'Hide', [], {});
      const tree = new FsLogicTreeDeepInternal('root', b);
      expect(tree.getDependantFieldIds()).toStrictEqual([]);
    });
  });
  describe('.appendFieldIdNode()', () => {
    it('Should append fieldId to dependency list of single node tree (new with root node).', () => {
      // spyOn(FsLogicTreeDeepInternal.prototype, 'appendChildNodeWithContent').and.callThrough();
      // spyOn<any>(FsLogicTreeDeepInternal.prototype, 'appendFieldIdNode').and.callThrough();

      const b = new FsLogicBranchNode('fieldId', '$not', 'Hide', [], {});
      const tree = new FsLogicTreeDeepInternal('root', b);
      const spy = jest.spyOn(tree as any, 'appendFieldIdNode');
      tree.appendChildNodeWithContent(tree.rootNodeId, b);
      // appendChildNodeWithContent;
      expect(spy).toHaveBeenCalledWith('fieldId', b);
      expect(tree.getDependantFieldIds()).toStrictEqual(['fieldId']);
    });
    it('Should append fieldId to dependency list of single node tree (new with root node).', () => {
      const b = new FsLogicBranchNode('fieldId', '$not', 'Hide', [], {});
      const tree = new FsLogicTreeDeepInternal('root', b);
      tree.appendChildNodeWithContent(tree.rootNodeId, b);
      expect(tree.getDependantFieldIds()).toStrictEqual(['fieldId']);
    });
  });
  describe('.appendChildNodeWithContent()', () => {
    it('Should throw an error if parent nodeId does not exist. (isNodeIdExist)', () => {
      const b = new FsLogicBranchNode('fieldId', '$not', 'Hide', [], {});
      const tree = new FsLogicTreeDeepInternal('root', b);
      const spy = jest
        .spyOn(tree as any, 'isNodeIdExist')
        .mockReturnValue(false);

      const willThrow = () => {
        tree.appendChildNodeWithContent(tree.rootNodeId, b);
      };
      expect(willThrow).toThrow(
        new Error("parentNodeId does not exists. parentNodeId: 'root'.")
      );
    });
    it('Should throw an error if nodeContent does not contained something that looks like a fieldId. (extractFieldIdFromNodeContentOrThrow)', () => {
      const branch = new FsLogicBranchNode(
        'fieldId_branch',
        '$not',
        'Hide',
        [],
        {}
      );
      const leaf = new FsLogicLeafNode(
        'fieldId_leaf',
        '$gte',
        '_ANYTHING_WILL_DO_'
      );
      const tree = new FsLogicTreeDeepInternal('root', branch);
      const spy = jest
        .spyOn(tree as any, 'extractFieldIdFromNodeContent')
        .mockReturnValue(null);

      const willThrow = () => {
        tree.appendChildNodeWithContent(tree.rootNodeId, leaf);
      };
      expect(willThrow).toThrow(
        new Error('Failed to extract fieldId from nodeContent.')
      );
    });
    it('Should throw an error if nodeContent does not contained something that looks like a fieldId. (extractFieldIdFromNodeContent)', () => {
      const branch = new FsLogicBranchNode(
        'fieldId_branch',
        '$not',
        'Hide',
        [],
        {}
      );

      const newNode = { something: 'that is not a logic node' };
      const tree = new FsLogicTreeDeepInternal('root', branch);

      const willThrow = () => {
        // @ts-ignore newNode is not a logic node.  The point of the test
        tree.appendChildNodeWithContent(tree.rootNodeId, newNode);
      };
      expect(willThrow).toThrow(
        new Error('Failed to extract fieldId from nodeContent.')
      );
    });
  });
  describe('getNodeIdOfNodeContent()', () => {
    it('Should return the nodeId of the nodeContent.', () => {
      const leaf = new FsLogicLeafNode('fieldId', '$gte', '_ANYTHING_WILL_DO_');
      const tree = new FsLogicTreeDeepInternal('root', leaf);
      expect(tree.getNodeIdOfNodeContent(leaf)).toBe(tree.rootNodeId);
    });
    it('Should null if nodeContent is not found.', () => {
      const leaf = new FsLogicLeafNode('fieldId', '$gte', '_ANYTHING_WILL_DO_');
      const tree = new FsLogicTreeDeepInternal('root', leaf);
      expect(tree.getNodeIdOfNodeContent({} as any)).toBeNull();
    });
  });
  describe('.toPojoAt()', () => {
    it('Should return original node if node  .toPojo() throws error.', () => {
      const newNode = {
        something: 'that is not a logic node',
        toPojo: () => {
          throw new Error('testing what happens when toPojo throws error');
        },
      };

      // const leaf = new FsLogicLeafNode('fieldId', '$gte', '_ANYTHING_WILL_DO_');
      // @ts-ignore newNode is not a leaf/branch nodes
      const tree = new FsLogicTreeDeepInternal('root', newNode);
      const pojo = tree.toPojoAt(tree.rootNodeId, false);

      expect(pojo).toStrictEqual({
        root: {
          parentId: 'root',
          nodeContent: newNode,
        },
      });
    });
    it('Should return original node if node  .toPojo() throws error.', () => {
      const newNode = {
        something: 'that is not a logic node',
        toPojo: () => {
          throw new Error('testing what happens when toPojo throws error');
        },
      };

      // const leaf = new FsLogicLeafNode('fieldId', '$gte', '_ANYTHING_WILL_DO_');
      // @ts-ignore newNode is not a leaf/branch nodes
      const tree = new FsLogicTreeDeepInternal('root', newNode);
      const pojo = tree.toPojoAt(tree.rootNodeId);
      const keys = Object.keys(pojo);
      expect(keys.length).toEqual(1);
      expect(pojo[keys[0]]).toStrictEqual({
        parentId: keys[0],
        nodeContent: newNode,
      });
    });
  });
});
