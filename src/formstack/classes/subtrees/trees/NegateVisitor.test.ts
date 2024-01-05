import { NegateVisitor } from './NegateVisitor';
import formJson5375703 from '../../../../test-dev-resources/form-json/5375703.json';
import { FsFormModel } from '../FsFormModel';
import {
  FsLogicTreeDeep,
  TApiForm,
  TApiFormJson,
  transformers,
} from '../../../../formstack';
import { TGenericNodeContent } from 'predicate-tree-advanced-poc/dist/src';
import { AbstractLogicNode } from './FsLogicTreeDeep/LogicNodes/AbstractLogicNode';

describe('NegateVisitor', () => {
  it('should negate a simple expression (root).', () => {
    // set-up
    const visitor = new NegateVisitor();
    const tree5375703 = FsFormModel.fromApiFormJson(
      transformers.formJson(formJson5375703 as unknown as TApiFormJson)
    );
    const agTree153051795 = tree5375703.aggregateLogicTree('153051795'); //Conflict with show/hide, panel/field (parent panel)
    const nodeContent = agTree153051795.getChildContentByFieldId(
      agTree153051795.rootNodeId
    );
    const pojoBefore = nodeContent.toPojo();

    // pre condition
    expect(pojoBefore).toStrictEqual({
      nodeType: 'FsLogicBranchNode',
      ownerFieldId: '153051795',
      action: 'hide',
      conditional: 'any',
    });

    // exercise
    visitor.visit(
      agTree153051795.rootNodeId,
      nodeContent,
      agTree153051795.rootNodeId
    );

    // post condition
    const pojoAfter = nodeContent.toPojo();

    expect(pojoAfter).toStrictEqual({
      nodeType: 'FsLogicBranchNode',
      ownerFieldId: '153051795',
      action: 'hide', // action - not an element of logic expression
      conditional: 'all',
    });
  });
  it('should negate a simple expression (leaf).', () => {
    // set-up
    const visitor = new NegateVisitor();
    const tree5375703 = FsFormModel.fromApiFormJson(
      transformers.formJson(formJson5375703 as unknown as TApiFormJson)
    );

    const agTree153051795 = tree5375703.aggregateLogicTree('153051795'); //Conflict with show/hide, panel/field (parent panel)

    // pre condition
    const nodeContent = {
      nodeType: 'FsLogicLeafNode',
      fieldId: '153051795',
      condition: 'equals',
      option: '1',
    };

    // exercise
    visitor.visit(
      agTree153051795.rootNodeId,
      nodeContent as unknown as TGenericNodeContent<AbstractLogicNode>,
      agTree153051795.rootNodeId
    );

    expect(nodeContent).toStrictEqual({
      nodeType: 'FsLogicLeafNode',
      fieldId: '153051795',
      condition: 'notequals',
      option: '1',
    });
  });
  it('should do nothing if the nodeContent is undefined/null.', () => {
    // set-up
    const visitor = new NegateVisitor();

    // pre condition
    const nodeContent = {
      nodeType: 'FsLogicLeafNode',
      fieldId: '153051795',
      condition: 'equals',
      option: '1',
    };

    // exercise
    visitor.visit(
      '_THIS_DOESNT_GET_USED_FOR_THIS_VISITOR_',
      // @ts-ignore
      undefined,
      '_THIS_DOESNT_GET_USED_FOR_THIS_VISITOR_'
    );

    expect(nodeContent).toStrictEqual({
      nodeType: 'FsLogicLeafNode',
      fieldId: '153051795',
      condition: 'equals',
      option: '1',
    });
  });
});
