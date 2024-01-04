import { IExpressionTree } from 'predicate-tree-advanced-poc/dist/src';
import { AbstractFsFieldLogicModel } from './AbstractFsFieldLogicModel';
class TestAbstractFsFieldLogicModel extends AbstractFsFieldLogicModel<any> {
  createSubtreeAt(nodeId: string): IExpressionTree<any> {
    // for testing purposes, we don't need to implement this
    return new TestAbstractFsFieldLogicModel();
  }
}

describe('AbstractFsFieldLogicModel', () => {
  it('Should be awesome', () => {
    const tree = new TestAbstractFsFieldLogicModel();
    expect(tree).toBeInstanceOf(AbstractFsFieldLogicModel);
  });
  describe('.action', () => {
    it('Should be able to  "get" action AND "action" must be set by subclasses.', () => {
      const tree = new TestAbstractFsFieldLogicModel('_root_seed_');
      expect(tree.action).toBeUndefined();
    });
    it('Should *NOT* be able to set action', () => {
      const tree = new TestAbstractFsFieldLogicModel('_root_seed_');
      const willThrow = () => {
        // @ts-ignore - test subject.
        tree.action = 'show';
      };
      expect(willThrow).toThrow(
        'Cannot set property action of #<AbstractFsFieldLogicModel> which has only a getter'
      );
    });
  });
  describe('.ownerFieldId', () => {
    it('Should be able to  "get" ownerFieldId.', () => {
      const tree = new TestAbstractFsFieldLogicModel('_root_seed_');
      expect(tree.ownerFieldId).toBeUndefined();
    });
    it('Should be able to set ownerFieldId.', () => {
      const tree = new TestAbstractFsFieldLogicModel('_root_seed_');
      tree.ownerFieldId = '_ANYTHING_WILL_DO_';
      expect(tree.ownerFieldId).toBe('_ANYTHING_WILL_DO_');
    });
  });
});
