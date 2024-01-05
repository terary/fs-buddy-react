import { FsMaxDepthExceededNode } from './FsMaxDepthExceededNode';

describe('FsMaxDepthExceededNode', () => {
  let node: FsMaxDepthExceededNode;

  beforeEach(() => {
    node = new FsMaxDepthExceededNode();
  });

  it('should have the correct node type', () => {
    expect(node.nodeType).toBe('FsMaxDepthExceededNode');
  });

  it('should return a valid POJO representation', () => {
    const pojo = node.toPojo();
    expect(pojo).toEqual(expect.any(Object));
    // Add more specific assertions for the POJO representation
  });

  it('should return the correct status message', () => {
    const rootFieldId = 'rootFieldId';
    const dependentChainFieldIds = ['dependentFieldId1', 'dependentFieldId2'];
    const statusMessage = node.getStatusMessage(
      rootFieldId,
      dependentChainFieldIds
    );
    expect(statusMessage).toEqual(expect.any(Array));
    // Add more specific assertions for the status message
  });
});
