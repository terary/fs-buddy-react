import { FieldLogicService } from './FieldLogicService';
import formJson5469299 from '../../test-dev-resources/form-json/5469299.json';
import formJson5375703 from '../../test-dev-resources/form-json/5375703.json';
import notificationJson5375703 from '../../test-dev-resources/notification-json/5375703.json';
import webhookJson5375703 from '../../test-dev-resources/webhook-json/5375703.json';
import { FsFormModel, transformers } from '..';
import type { TApiFormJson } from '..';
import formJson5488291 from '../../test-dev-resources/form-json/5488291.json';

describe('FieldLogicService', () => {
  describe('.getAllFieldSummary()', () => {
    it('Should return a list of field summaries', () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      const fieldSummaryList = fieldLogic.getAllFieldSummary();

      expect(fieldSummaryList).toStrictEqual(fieldSummaryformJson5375703);
    });
  });
  describe('.getStatusMessagesByFieldId()', () => {
    it('Should return a list of status messages for a field', () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      const statusMessages = fieldLogic.getStatusMessagesByFieldId('148456742');

      expect(statusMessages).toStrictEqual(statusMessages148456742);
    });
  });
  describe('.getLogicNodeGraphMap()', () => {
    it('Should return a field logic map to be used for d3 hierarchy graph.', () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      const logicNodeGraphMap = fieldLogic.getLogicNodeGraphMap('148456742');
      expect(logicNodeGraphMap).toStrictEqual(graphMap148456742);
    });
  });
  describe('.getFormLogicStatusMessages()', () => {
    it('Should find fieldId in logic that are not in the form.', () => {
      const fieldLogicService = new FieldLogicService(
        transformers.formJson(formJson5488291 as unknown as TApiFormJson)
      );

      const statusMessages = fieldLogicService.getFormLogicStatusMessages();
      expect(statusMessages).toStrictEqual([
        {
          severity: 'error',
          fieldId: null,
          message:
            'Found fieldId used in logic but not in form. fieldId: "9153115414". ',
          relatedFieldIds: [],
        },
        {
          severity: 'logic',
          fieldId: null,
          message:
            "Checked all fieldIds in logic expression are contained in this form (don't laugh, it happens).<br />",
          relatedFieldIds: [],
        },
        {
          severity: 'logic',
          fieldId: null,
          message:
            'Field Leaf Usage (field actual in leaf expression): <pre><code>{\n  "153115729": 1,\n  "9153115414": 1\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'logic',
          fieldId: null,
          message:
            'Logic composition: <pre><code>{\n  "totalNodes": 7,\n  "totalCircularLogicNodes": 1,\n  "totalUnclassifiedNodes": 0,\n  "totalLeafNodes": 2,\n  "totalBranchNodes": 2,\n  "totalRootNodes": 2,\n  "leafToNodeRatio": "0.2857",\n  "branchToNodeRatio": "0.2857",\n  "leafToBranchRatio": "1.0000"\n}</code></pre>\n      <ul>\n        <li>totalNodes - Each time a field involved in a logic expression. If a field is used twice this will be reflected in this number</li>\n        <li>totalCircularLogicNodes - Logic conflict at the branch level.</li>\n        <li>totalCircularExclusiveLogicNodes - Logic conflict at the leaf level, non-resolvable.</li>\n        <li>totalCircularInclusiveLogicNodes - Logic conflict at the leaf level, resolvable.</li>\n        <li>totalLeafNodes - Logic terms (the actual "x equal _SOMETHING_").</li>\n        <li>totalBranchNodes - Logic branch (something like: "Show" if _ANY_...).</li>\n        <li>totalRootNodes - The field that owns the logic expression.</li>\n        <li>Note: Circular nodes indicates invalid logic expression. If an expression is invalid these counts may not be accurate.</li>\n        <li>branchToNodeRatio - higher number indicates need to break into multiple forms.</li>\n        <li>leafToBranchRatio - higher number indicates good usage of logic .</li>\n      </ul>\n    ',
          relatedFieldIds: [],
        },
        {
          severity: 'logic',
          fieldId: null,
          message: 'Number of fields with root logic:  2',
          relatedFieldIds: ['153112633', '153115729'],
        },
        {
          severity: 'logic',
          fieldId: null,
          message: 'Number of fields without root logic:  3',
          relatedFieldIds: [],
        },
        {
          severity: 'warn',
          fieldId: null,
          message: 'Number of fields with circular references:  1',
          relatedFieldIds: ['153115729'],
        },
        {
          severity: 'logic',
          fieldId: null,
          message: 'Number of fields with general logic errors:  0',
          relatedFieldIds: [],
        },
      ]);
    });

    it('Should separate different circular reference', () => {
      const fieldLogicService = new FieldLogicService(
        transformers.formJson(
          formJson5469299 as unknown as TApiFormJson
          // formJson5375703 as unknown as TApiFormJson
        )
      );

      const statusMessages = fieldLogicService.getFormLogicStatusMessages();
      expect(statusMessages).toStrictEqual([
        {
          severity: 'logic',
          fieldId: null,
          message:
            "Checked all fieldIds in logic expression are contained in this form (don't laugh, it happens).<br />",
          relatedFieldIds: [],
        },
        {
          severity: 'logic',
          fieldId: null,
          message:
            'Field Leaf Usage (field actual in leaf expression): <pre><code>{\n  "152290545": 5,\n  "152290547": 1,\n  "152290548": 2,\n  "152290549": 3,\n  "152290551": 11,\n  "152290553": 7,\n  "152290554": 7,\n  "152290555": 7,\n  "152290556": 7,\n  "152290557": 7,\n  "152290558": 7,\n  "152290561": 1,\n  "152290562": 1,\n  "152290564": 1,\n  "152290565": 1,\n  "152290568": 5,\n  "152290569": 4,\n  "152290570": 4,\n  "152290571": 4,\n  "152291690": 1,\n  "152293117": 10\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'logic',
          fieldId: null,
          message:
            'Logic composition: <pre><code>{\n  "totalNodes": 225,\n  "totalCircularLogicNodes": 48,\n  "totalUnclassifiedNodes": 0,\n  "totalLeafNodes": 96,\n  "totalBranchNodes": 56,\n  "totalRootNodes": 25,\n  "leafToNodeRatio": "0.4267",\n  "branchToNodeRatio": "0.2489",\n  "leafToBranchRatio": "1.7143"\n}</code></pre>\n      <ul>\n        <li>totalNodes - Each time a field involved in a logic expression. If a field is used twice this will be reflected in this number</li>\n        <li>totalCircularLogicNodes - Logic conflict at the branch level.</li>\n        <li>totalCircularExclusiveLogicNodes - Logic conflict at the leaf level, non-resolvable.</li>\n        <li>totalCircularInclusiveLogicNodes - Logic conflict at the leaf level, resolvable.</li>\n        <li>totalLeafNodes - Logic terms (the actual "x equal _SOMETHING_").</li>\n        <li>totalBranchNodes - Logic branch (something like: "Show" if _ANY_...).</li>\n        <li>totalRootNodes - The field that owns the logic expression.</li>\n        <li>Note: Circular nodes indicates invalid logic expression. If an expression is invalid these counts may not be accurate.</li>\n        <li>branchToNodeRatio - higher number indicates need to break into multiple forms.</li>\n        <li>leafToBranchRatio - higher number indicates good usage of logic .</li>\n      </ul>\n    ',
          relatedFieldIds: [],
        },
        {
          severity: 'logic',
          fieldId: null,
          message: 'Number of fields with root logic:  21',
          relatedFieldIds: [
            '152290543',
            '152291688',
            '152290546',
            '152290547',
            '152290548',
            '152290549',
            '152586401',
            '152586428',
            '152293116',
            '152297010',
            '152290552',
            '152290553',
            '152290556',
            '152290560',
            '152290563',
            '152290567',
            '152290568',
            '152290569',
            '152290570',
            '153413614',
            '153413615',
          ],
        },
        {
          severity: 'logic',
          fieldId: null,
          message: 'Number of fields without root logic:  18',
          relatedFieldIds: [],
        },
        {
          severity: 'warn',
          fieldId: null,
          message: 'Number of fields with circular references:  11',
          relatedFieldIds: [
            '152290552',
            '152290553',
            '152290554',
            '152290555',
            '152290556',
            '152290557',
            '152290558',
            '152290567',
            '152290568',
            '152290569',
            '152290570',
          ],
        },
        {
          severity: 'logic',
          fieldId: null,
          message: 'Number of fields with general logic errors:  0',
          relatedFieldIds: [],
        },
      ]);
    });
  });

  describe('.getFieldIdsWithLogic() (aka branches)', () => {
    it('Should return all fieldIds for fields with logic', () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const fieldIds = fieldLogic.getFieldIdsWithLogic();
      expect(fieldIds.sort()).toStrictEqual(
        [
          '151701616',
          '156919669',
          '148456734',
          '148456742',
          '148456741',
          '148456740',
          '148456739',
          '153051795',
          '153051796',
          '154795680',
          '154795826',
          '148509465',
          '148509470',
          '148509476',
          '154328256',
          '152139062',
          '152139065',
          '148604161',
          '148604236',
          '148604235',
          '148604234',
          '156917123',
          '156917124',
        ].sort()
      );
    });
  });
  describe('.getFieldIdsWithoutLogic() (aka leaves)', () => {
    it('Should return all fieldIds for fields with logic', () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const fieldIds = fieldLogic.getFieldIdsWithoutLogic();
      expect(fieldIds.sort()).toStrictEqual(
        [
          '154796590',
          '156906187',
          '154795678',
          '151702085',
          '148456700',
          '151678347',
          '148509478',
          '148509477',
          '148509475',
          '148509474',
          '154328257',
          '154328258',
          '154328259',
          '154328260',
          '154328261',
          '154328262',
          '152139061',
          '152139063',
          '152139064',
          '152139066',
          '152139068',
          '148604159',
          '148604239',
          '156917750',
          '156917751',
        ].sort()
      );
    });
  });
  describe('.getFieldIdsAll()', () => {
    it('Should return all fieldIds for fields with logic', () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const fieldIds = fieldLogic.getFieldIdsAll();
      expect(fieldIds.sort()).toStrictEqual(
        [
          '151701616',
          '156919669',
          '154796590',
          '156906187',
          '154795678',
          '151702085',
          '148456734',
          '148456742',
          '148456741',
          '148456740',
          '148456739',
          '148456700',
          '151678347',
          '153051795',
          '153051796',
          '154795680',
          '154795826',
          '148509465',
          '148509470',
          '148509478',
          '148509477',
          '148509476',
          '148509475',
          '148509474',
          '154328256',
          '154328257',
          '154328258',
          '154328259',
          '154328260',
          '154328261',
          '154328262',
          '152139061',
          '152139062',
          '152139063',
          '152139064',
          '152139065',
          '152139066',
          '152139068',
          '148604159',
          '148604161',
          '148604236',
          '148604235',
          '148604234',
          '148604239',
          '156917123',
          '156917750',
          '156917124',
          '156917751',
        ].sort()
      );
    });
  });
  describe('.getFieldIdsExtendedLogicOf(fieldId)', () => {
    it('Should return all fieldIds for fields with logic', () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const fieldIds = fieldLogic.getFieldIdsExtendedLogicOf('148509465');
      expect(fieldIds.sort()).toStrictEqual(
        ['148509465', '148509470', '148509476'].sort()
      );
    });
  });

  describe('.getCircularReferenceFieldIds()', () => {
    it('Should return an array of field ids with circular logic', () => {
      const fieldLogicService = new FieldLogicService(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      expect(
        fieldLogicService.getCircularReferenceFieldIds('148456739')
      ).toStrictEqual(['148456741', '148456740']);
    });
  });
  describe('.getFieldIdsWithCircularReferences()', () => {
    it('Should return an array of field ids with circular logic', () => {
      const fieldLogicService = new FieldLogicService(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );
      const fieldIds = fieldLogicService.getFieldIdsWithCircularReferences();
      expect(fieldIds).toStrictEqual([
        '148456734',
        '148456739',
        '148456740',
        '148456741',
        '148456742',
        '148509465',
        '148509470',
        '148509474',
        '148509475',
        '148509476',
        '148509477',
        '148509478',
        '148604161',
        '148604234',
        '148604235',
        '148604236',
        '151701616',
        '154328256',
        '154328257',
        '154328258',
        '154328259',
        '154328260',
        '154328261',
        '154328262',
      ]);
    });
  });
  describe('.wrapFieldIdsIntoLabelOptionList(...)', () => {
    it('Should return a list of value/label pairs.', () => {
      const fieldLogic = new FieldLogicService(
        transformers.formJson(formJson5375703 as unknown as TApiFormJson)
      );

      const labelValueList = fieldLogic.wrapFieldIdsIntoLabelOptionList([
        '148509465',
        '148509478',
        '151702085',
      ]);

      expect(labelValueList).toStrictEqual([
        {
          value: '148509465',
          label: '(Error) (section) Inter-dependent (not so much circular)',
        },
        {
          value: '148509478',
          label: '(Error) A.0 (inter-dependent)',
        },
        {
          value: '151702085',
          label: '(richtext)',
        },
      ]);
    });
  });
});

const fieldSummaryformJson5375703 = {
  '148456700': {
    fieldId: '148456700',
    label: ' (section) ',
    type: 'section',
  },
  '148456734': {
    fieldId: '148456734',
    label: '(A) A->B->C-D->E->A (logic)',
    type: 'checkbox',
  },
  '148456739': {
    fieldId: '148456739',
    label: '(E) A->B->C-D->E->A (logic)',
    type: 'checkbox',
  },
  '148456740': {
    fieldId: '148456740',
    label: '(D) A->B->C-D->E->A (logic)',
    type: 'checkbox',
  },
  '148456741': {
    fieldId: '148456741',
    label: '(C) A->B->C-D->E->A (logic)',
    type: 'checkbox',
  },
  '148456742': {
    fieldId: '148456742',
    label: '(B) A->B->C-D->E->A (logic)',
    type: 'checkbox',
  },
  '148509465': {
    fieldId: '148509465',
    label: 'Inter-dependent (not so much circular)',
    type: 'section',
  },
  '148509470': {
    fieldId: '148509470',
    label: 'A (inter-dependent) ',
    type: 'checkbox',
  },
  '148509474': {
    fieldId: '148509474',
    label: 'B.1 (inter-dependent)',
    type: 'checkbox',
  },
  '148509475': {
    fieldId: '148509475',
    label: 'B.0 (inter-dependent)',
    type: 'checkbox',
  },
  '148509476': {
    fieldId: '148509476',
    label: 'B (inter-dependent)',
    type: 'checkbox',
  },
  '148509477': {
    fieldId: '148509477',
    label: 'A.1 (inter-dependent)',
    type: 'checkbox',
  },
  '148509478': {
    fieldId: '148509478',
    label: 'A.0 (inter-dependent)',
    type: 'checkbox',
  },
  '148604159': {
    fieldId: '148604159',
    label: 'Big Dipper + Leaf',
    type: 'section',
  },
  '148604161': {
    fieldId: '148604161',
    label: '(A) Big Dipper A->B->C->D->(B ^ E) ',
    type: 'checkbox',
  },
  '148604234': {
    fieldId: '148604234',
    label: '(D) Big Dipper A->B->C->D->(B ^ E)',
    type: 'checkbox',
  },
  '148604235': {
    fieldId: '148604235',
    label: '(C) Big Dipper A->B->C->D->(B ^ E)',
    type: 'checkbox',
  },
  '148604236': {
    fieldId: '148604236',
    label: '(B) Big Dipper A->B->C->D->(B ^ E)',
    type: 'checkbox',
  },
  '148604239': {
    fieldId: '148604239',
    label: '(E) Leaf Node',
    type: 'number',
  },
  '151678347': {
    fieldId: '151678347',
    label: 'Switzerland',
    type: 'radio',
  },
  '151701616': {
    fieldId: '151701616',
    label: ' (richtext) ',
    type: 'richtext',
  },
  '151702085': {
    fieldId: '151702085',
    label: ' (richtext) ',
    type: 'richtext',
  },
  '152139061': {
    fieldId: '152139061',
    label: 'Triangle - ideal use',
    type: 'section',
  },
  '152139062': {
    fieldId: '152139062',
    label: 'A (ideal)',
    type: 'checkbox',
  },
  '152139063': {
    fieldId: '152139063',
    label: 'A.0 (ideal)',
    type: 'checkbox',
  },
  '152139064': {
    fieldId: '152139064',
    label: 'A.1 (ideal)',
    type: 'checkbox',
  },
  '152139065': {
    fieldId: '152139065',
    label: 'B (ideal)',
    type: 'checkbox',
  },
  '152139066': {
    fieldId: '152139066',
    label: 'B.0 (ideal)',
    type: 'checkbox',
  },
  '152139068': {
    fieldId: '152139068',
    label: 'B.1 (ideal)',
    type: 'checkbox',
  },
  '153051795': {
    fieldId: '153051795',
    label: 'Conflict with show/hide, panel/field (parent panel)',
    type: 'section',
  },
  '153051796': {
    fieldId: '153051796',
    label: 'Short Answer',
    type: 'text',
  },
  '154328256': {
    fieldId: '154328256',
    label: 'Inter-dependent (not so much circular) no internal logic',
    type: 'section',
  },
  '154328257': {
    fieldId: '154328257',
    label: 'A (no internal logic)',
    type: 'checkbox',
  },
  '154328258': {
    fieldId: '154328258',
    label: 'A.0 (no internal logic)',
    type: 'checkbox',
  },
  '154328259': {
    fieldId: '154328259',
    label: 'A.1 (no internal logic)',
    type: 'checkbox',
  },
  '154328260': {
    fieldId: '154328260',
    label: 'B (no internal logic)',
    type: 'checkbox',
  },
  '154328261': {
    fieldId: '154328261',
    label: 'B.0 (no internal logic)',
    type: 'checkbox',
  },
  '154328262': {
    fieldId: '154328262',
    label: 'B.1 (no internal logic)',
    type: 'checkbox',
  },
  '154795678': {
    fieldId: '154795678',
    label: 'binary',
    type: 'checkbox',
  },
  '154795680': {
    fieldId: '154795680',
    label: 'Conflict with show/hide, panel/field - (Child panel)',
    type: 'section',
  },
  '154795826': {
    fieldId: '154795826',
    label: 'The Number',
    type: 'number',
  },
  '154796590': {
    fieldId: '154796590',
    label: 'Some Number',
    type: 'number',
  },
  '156906187': {
    fieldId: '156906187',
    label: 'Email (for Confirmation)',
    type: 'email',
  },
  '156917123': {
    fieldId: '156917123',
    label: 'Two Panel With Conflicting Logic (A)',
    type: 'section',
  },
  '156917124': {
    fieldId: '156917124',
    label: 'Two Panel With Conflicting Logic (B)',
    type: 'section',
  },
  '156917750': {
    fieldId: '156917750',
    label: 'AlwaysTrueRadioButton',
    type: 'radio',
  },
  '156917751': {
    fieldId: '156917751',
    label: 'AlwaysFalseRadioButton',
    type: 'radio',
  },
  '156919669': {
    fieldId: '156919669',
    label: 'Two Panel With Conflicting Logic (Control Field)',
    type: 'text',
  },
};

const graphMap148456742 = [
  {
    nodeId: '148456742',
    parentId: '',
    nodeContent: {
      nodeId: '148456742',
      nodeType: 'FsVirtualRootNode',
      fieldId: '148456742',
      label: '(B) A->B->C-D->E->A (logi...',
      operationLabel: ['vRoot', 'if all'],
      operand: 'all',
    },
  },
  {
    nodeId: '148456742:0',
    parentId: '148456742',
    nodeContent: {
      nodeId: '148456742:0',
      nodeType: 'FsLogicBranchNode',
      fieldId: '148456742',
      label: '(B) A->B->C-D->E->A (logi...',
      operationLabel: ['show', 'if all'],
      operand: 'all',
    },
  },
  {
    nodeId: '148456742:0:1',
    parentId: '148456742:0',
    nodeContent: {
      nodeId: '148456742:0:1',
      nodeType: 'FsLogicLeafNode',
      fieldId: '148456741',
      label: '(C) A->B->C-D->E->A (logi...',
      operationLabel: ['equals', 'OptionA'],
      operand: 'equals',
    },
  },
  {
    nodeId: '148456742:0:2',
    parentId: '148456742:0',
    nodeContent: {
      nodeId: '148456742:0:2',
      nodeType: 'FsLogicBranchNode',
      fieldId: '148456741',
      label: '(C) A->B->C-D->E->A (logi...',
      operationLabel: ['show', 'if all'],
      operand: 'all',
    },
  },
  {
    nodeId: '148456742:0:2:3',
    parentId: '148456742:0:2',
    nodeContent: {
      nodeId: '148456742:0:2:3',
      nodeType: 'FsLogicLeafNode',
      fieldId: '148456740',
      label: '(D) A->B->C-D->E->A (logi...',
      operationLabel: ['equals', 'OptionA'],
      operand: 'equals',
    },
  },
  {
    nodeId: '148456742:0:2:4',
    parentId: '148456742:0:2',
    nodeContent: {
      nodeId: '148456742:0:2:4',
      nodeType: 'FsLogicBranchNode',
      fieldId: '148456740',
      label: '(D) A->B->C-D->E->A (logi...',
      operationLabel: ['show', 'if all'],
      operand: 'all',
    },
  },
  {
    nodeId: '148456742:0:2:4:5',
    parentId: '148456742:0:2:4',
    nodeContent: {
      nodeId: '148456742:0:2:4:5',
      nodeType: 'FsLogicLeafNode',
      fieldId: '148456739',
      label: '(E) A->B->C-D->E->A (logi...',
      operationLabel: ['equals', 'OptionA'],
      operand: 'equals',
    },
  },
  {
    nodeId: '148456742:0:2:4:6',
    parentId: '148456742:0:2:4',
    nodeContent: {
      nodeId: '148456742:0:2:4:6',
      nodeType: 'FsLogicBranchNode',
      fieldId: '148456739',
      label: '(E) A->B->C-D->E->A (logi...',
      operationLabel: ['show', 'if all'],
      operand: 'all',
    },
  },
  {
    nodeId: '148456742:0:2:4:6:7',
    parentId: '148456742:0:2:4:6',
    nodeContent: {
      nodeId: '148456742:0:2:4:6:7',
      nodeType: 'FsLogicLeafNode',
      fieldId: '148456734',
      label: '(A) A->B->C-D->E->A (logi...',
      operationLabel: ['equals', 'OptionA'],
      operand: 'equals',
    },
  },
  {
    nodeId: '148456742:0:2:4:6:8',
    parentId: '148456742:0:2:4:6',
    nodeContent: {
      nodeId: '148456742:0:2:4:6:8',
      nodeType: 'FsLogicBranchNode',
      fieldId: '148456734',
      label: '(A) A->B->C-D->E->A (logi...',
      operationLabel: ['show', 'if all'],
      operand: 'all',
    },
  },
  {
    nodeId: '148456742:0:2:4:6:8:9',
    parentId: '148456742:0:2:4:6:8',
    nodeContent: {
      nodeId: '148456742:0:2:4:6:8:9',
      nodeType: 'FsLogicLeafNode',
      fieldId: '148456742',
      label: '(B) A->B->C-D->E->A (logi...',
      operationLabel: ['equals', 'OptionA'],
      operand: 'equals',
    },
  },
  {
    nodeId: '148456742:0:2:4:6:8:10',
    parentId: '148456742:0:2:4:6:8',
    nodeContent: {
      nodeId: '148456742:0:2:4:6:8:10',
      nodeType: 'FsCircularDependencyNode',
      fieldId: '148456734',
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
      sourceFieldId: '148456734',
      sourceNodeId: '148456742:0',
      targetFieldId: '148456742',
      targetNodeId: '148456742:0:2:4:6:8:10',
      operationLabel: ['Circular Ref', 'A: (show / all)', 'B: (show / all)'],
      label: '(A) A->B->C-D->E->A (logi...',
    },
  },
];

const statusMessages148456742 = [
  {
    severity: 'debug',
    fieldId: '148456742',
    message:
      '<pre><code>{\n  "nodeType": "FsLogicBranchNode",\n  "ownerFieldId": "148456742",\n  "action": "show",\n  "conditional": "all",\n  "json": {\n    "action": "show",\n    "conditional": "all",\n    "checks": [\n      {\n        "field": "148456741",\n        "condition": "equals",\n        "option": "OptionA"\n      }\n    ]\n  }\n}</code></pre>',
  },
  {
    severity: 'logic',
    fieldId: '148456742',
    message:
      'action: \'show\', conditional: \'all\', checks(1): \'<pre><code>{\n  "action": "show",\n  "conditional": "all",\n  "checks": [\n    {\n      "field": "148456741",\n      "condition": "equals",\n      "option": "OptionA"\n    }\n  ]\n}</code></pre>\'.',
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'debug',
    fieldId: '148456741',
    message:
      '<pre><code>{\n  "nodeType": "FsLogicLeafNode",\n  "fieldId": "148456741",\n  "condition": "equals",\n  "option": "OptionA"\n}</code></pre>',
  },
  {
    severity: 'logic',
    fieldId: '148456741',
    message:
      "logic: (root fieldId: 148456742) requires  this field to 'equals' ->  'OptionA' ",
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'debug',
    fieldId: '148456741',
    message:
      '<pre><code>{\n  "nodeType": "FsLogicBranchNode",\n  "ownerFieldId": "148456741",\n  "action": "show",\n  "conditional": "all",\n  "json": {\n    "action": "show",\n    "conditional": "all",\n    "checks": [\n      {\n        "field": 148456740,\n        "condition": "equals",\n        "option": "OptionA"\n      }\n    ]\n  }\n}</code></pre>',
  },
  {
    severity: 'logic',
    fieldId: '148456741',
    message: '148456742 depends on the visibility of this field.',
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'debug',
    fieldId: '148456740',
    message:
      '<pre><code>{\n  "nodeType": "FsLogicLeafNode",\n  "fieldId": "148456740",\n  "condition": "equals",\n  "option": "OptionA"\n}</code></pre>',
  },
  {
    severity: 'logic',
    fieldId: '148456740',
    message:
      "logic: (root fieldId: 148456742) requires  this field to 'equals' ->  'OptionA' ",
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'debug',
    fieldId: '148456740',
    message:
      '<pre><code>{\n  "nodeType": "FsLogicBranchNode",\n  "ownerFieldId": "148456740",\n  "action": "show",\n  "conditional": "all",\n  "json": {\n    "action": "show",\n    "conditional": "all",\n    "checks": [\n      {\n        "field": 148456739,\n        "condition": "equals",\n        "option": "OptionA"\n      }\n    ]\n  }\n}</code></pre>',
  },
  {
    severity: 'logic',
    fieldId: '148456740',
    message: '148456742 depends on the visibility of this field.',
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'debug',
    fieldId: '148456739',
    message:
      '<pre><code>{\n  "nodeType": "FsLogicLeafNode",\n  "fieldId": "148456739",\n  "condition": "equals",\n  "option": "OptionA"\n}</code></pre>',
  },
  {
    severity: 'logic',
    fieldId: '148456739',
    message:
      "logic: (root fieldId: 148456742) requires  this field to 'equals' ->  'OptionA' ",
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'debug',
    fieldId: '148456739',
    message:
      '<pre><code>{\n  "nodeType": "FsLogicBranchNode",\n  "ownerFieldId": "148456739",\n  "action": "show",\n  "conditional": "all",\n  "json": {\n    "action": "show",\n    "conditional": "all",\n    "checks": [\n      {\n        "field": "148456734",\n        "condition": "equals",\n        "option": "OptionA"\n      }\n    ]\n  }\n}</code></pre>',
  },
  {
    severity: 'logic',
    fieldId: '148456739',
    message: '148456742 depends on the visibility of this field.',
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'debug',
    fieldId: '148456734',
    message:
      '<pre><code>{\n  "nodeType": "FsLogicLeafNode",\n  "fieldId": "148456734",\n  "condition": "equals",\n  "option": "OptionA"\n}</code></pre>',
  },
  {
    severity: 'logic',
    fieldId: '148456734',
    message:
      "logic: (root fieldId: 148456742) requires  this field to 'equals' ->  'OptionA' ",
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'debug',
    fieldId: '148456734',
    message:
      '<pre><code>{\n  "nodeType": "FsLogicBranchNode",\n  "ownerFieldId": "148456734",\n  "action": "show",\n  "conditional": "all",\n  "json": {\n    "action": "show",\n    "conditional": "all",\n    "checks": [\n      {\n        "field": 148456742,\n        "condition": "equals",\n        "option": "OptionA"\n      }\n    ]\n  }\n}</code></pre>',
  },
  {
    severity: 'logic',
    fieldId: '148456734',
    message: '148456742 depends on the visibility of this field.',
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'debug',
    fieldId: '148456742',
    message:
      '<pre><code>{\n  "nodeType": "FsLogicLeafNode",\n  "fieldId": "148456742",\n  "condition": "equals",\n  "option": "OptionA"\n}</code></pre>',
  },
  {
    severity: 'logic',
    fieldId: '148456742',
    message:
      "logic: (root fieldId: 148456742) requires  this field to 'equals' ->  'OptionA' ",
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'logic',
    fieldId: '148456742',
    message:
      "circular reference. root field: '148456742', logic of source field '148456742' attempted to add logic for fieldId: '148456742' which is already in the dependency chain. dependency chain: \"'148456742', '148456741', '148456740', '148456739', '148456734'\".",
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'error',
    fieldId: '148456742',
    message:
      "circular reference. root field: '148456742', logic of source field '148456742' attempted to add logic for fieldId: '148456742' which is already in the dependency chain. dependency chain: \"'148456742', '148456741', '148456740', '148456739', '148456734'\".",
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
  {
    severity: 'debug',
    fieldId: '148456742',
    message:
      '{"nodeType":"FsLogicBranchNode","fieldId":"148456742","conditional":"all"}',
  },
  {
    severity: 'logic',
    fieldId: '148456742',
    message: 'Virtual Branch',
    relatedFieldIds: [
      '148456742',
      '148456741',
      '148456740',
      '148456739',
      '148456734',
    ],
  },
];
