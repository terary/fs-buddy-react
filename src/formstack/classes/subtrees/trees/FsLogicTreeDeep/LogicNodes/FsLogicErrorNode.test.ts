import { FsLogicErrorNode } from './FsLogicErrorNode';

describe('FsLogicErrorNode', () => {
  describe('constructor', () => {
    it('should create an instance of FsLogicErrorNode', () => {
      const node = new FsLogicErrorNode(
        'rootFieldId',
        'parentFieldId',
        'fieldId',
        'error message',
        ['dependency1', 'dependency2']
      );

      expect(node).toBeInstanceOf(FsLogicErrorNode);
    });

    it('should set the correct properties', () => {
      const rootFieldId = 'rootFieldId';
      const parentFieldId = 'parentFieldId';
      const fieldId = 'fieldId';
      const message = 'error message';
      const dependentChain = ['dependency1', 'dependency2'];

      const node = new FsLogicErrorNode(
        rootFieldId,
        parentFieldId,
        fieldId,
        message,
        dependentChain
      );

      expect(node.fieldId).toBe(fieldId);
      expect(node.dependentChainFieldIds).toEqual(dependentChain);
    });
  });

  describe('toPojo', () => {
    it('should return the node as a plain object', () => {
      const node = new FsLogicErrorNode(
        'rootFieldId',
        'parentFieldId',
        'fieldId',
        'error message',
        ['dependency1', 'dependency2']
      );

      const pojo = node.toPojo();

      expect(pojo).toEqual({
        nodeType: 'FsLogicErrorNode',
        rootFieldId: 'rootFieldId',
        parentFieldId: 'parentFieldId',
        fieldId: 'fieldId',
        message: 'error message',
        dependentChainFieldIds: ['dependency1', 'dependency2'],
      });
    });
  });

  describe('getStatusMessage', () => {
    it('should return the status message', () => {
      const node = new FsLogicErrorNode(
        'rootFieldId',
        'parentFieldId',
        'fieldId',
        'error message',
        ['dependency1', 'dependency2']
      );

      const statusMessage = node.getStatusMessage('rootFieldId', [
        'dependency1',
        'dependency2',
      ]);

      expect(statusMessage).toEqual([
        {
          severity: 'error',
          fieldId: 'rootFieldId',
          message: 'error message',
          relatedFieldIds: ['dependency1', 'dependency2'],
        },
        {
          severity: 'debug',
          fieldId: 'rootFieldId',
          message:
            '<pre><code>{\n  "rootFieldId": "rootFieldId",\n  "parentFieldId": "fieldId",\n  "fieldId": "fieldId",\n  "message": "error message",\n  "dependencyChain": [\n    "dependency1",\n    "dependency2"\n  ]\n}</code></pre>',
          relatedFieldIds: ['dependency1', 'dependency2'],
        },
      ]);
    });
  });
});
