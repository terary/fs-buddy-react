import { FormAnalyticService } from './FormAnalyticService';
import formJson5456371 from '../../test-dev-resources/form-json/5456371.json';
import formJson5568576 from '../../test-dev-resources/form-json/5568576.json';

import workflowJson5456833 from '../../test-dev-resources/form-json/5456833.json';
import { transformers as jsonTransformers } from '..';
import type { TApiFormJson } from '..';

describe('FormAnalyticService', () => {
  describe('.getLabelsWithAssociatedFieldIds()', () => {
    it('Should return an TSimpleDictionary<string[]> where label is key and an array fieldIds.', () => {
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(formJson5456371 as unknown as TApiFormJson)
      );

      expect(formAnalytic.getLabelsWithAssociatedFieldIds()).toStrictEqual({
        'Duplicate Label Thrice': ['151757114', '151757116', '151757119'],
        _NO_LABEL_FOUND_text: ['151757196'],
        'One Option': ['151757231'],
        'Empty Option': ['151757248'],
        'No Options': ['151757283'],
      });
    });
  });
  describe('.findKnownSetupIssues()', () => {
    it('Should return messages for all known form issues.', () => {
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(formJson5456371 as unknown as TApiFormJson)
      );
      const knownIssues = formAnalytic.findKnownSetupIssues();
      expect(knownIssues).toStrictEqual([
        {
          severity: 'info',
          fieldId: null,
          message: 'Form/Workflow type: "form".',
          relatedFieldIds: [],
        },
        {
          severity: 'info',
          fieldId: null,
          message: 'Total Fields: 7.',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151757114',
          message:
            'fieldId: 151757114, type: text, json: <pre><code>{\n  "logic": null,\n  "id": "151757114",\n  "label": "Duplicate Label Thrice",\n  "hide_label": "0",\n  "description": "",\n  "name": "duplicate_label_thrice",\n  "type": "text",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "0",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "text_size": 50,\n  "minlength": 0,\n  "maxlength": 0,\n  "placeholder": "",\n  "field_one_calculation": 0,\n  "field_two_calculation": 0,\n  "calculation_units": "",\n  "calculation_operator": "",\n  "calculation_type": "",\n  "calculation_allow_negatives": 0,\n  "hide_input_characters": 0,\n  "remove_data_from_emails": 0,\n  "require_confirmation": 0,\n  "confirmationText": "",\n  "restrict_data_access": 0\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151757116',
          message:
            'fieldId: 151757116, type: text, json: <pre><code>{\n  "logic": null,\n  "id": "151757116",\n  "label": "Duplicate Label Thrice",\n  "hide_label": "0",\n  "description": "",\n  "name": "duplicate_label_thrice",\n  "type": "text",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "1",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "text_size": 50,\n  "minlength": 0,\n  "maxlength": 0,\n  "placeholder": "",\n  "field_one_calculation": 0,\n  "field_two_calculation": 0,\n  "calculation_units": "",\n  "calculation_operator": "",\n  "calculation_type": "",\n  "calculation_allow_negatives": 0,\n  "hide_input_characters": 0,\n  "remove_data_from_emails": 0,\n  "require_confirmation": 0,\n  "confirmationText": "",\n  "restrict_data_access": 0\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151757119',
          message:
            'fieldId: 151757119, type: text, json: <pre><code>{\n  "logic": null,\n  "id": "151757119",\n  "label": "Duplicate Label Thrice",\n  "hide_label": "0",\n  "description": "",\n  "name": "duplicate_label_thrice",\n  "type": "text",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "2",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "text_size": 50,\n  "minlength": 0,\n  "maxlength": 0,\n  "placeholder": "",\n  "field_one_calculation": 0,\n  "field_two_calculation": 0,\n  "calculation_units": "",\n  "calculation_operator": "",\n  "calculation_type": "",\n  "calculation_allow_negatives": 0,\n  "hide_input_characters": 0,\n  "remove_data_from_emails": 0,\n  "require_confirmation": 0,\n  "confirmationText": "",\n  "restrict_data_access": 0\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151757196',
          message:
            'fieldId: 151757196, type: text, json: <pre><code>{\n  "logic": null,\n  "id": "151757196",\n  "label": "",\n  "hide_label": "0",\n  "description": "no label",\n  "name": "",\n  "type": "text",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "3",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "text_size": 50,\n  "minlength": 0,\n  "maxlength": 0,\n  "placeholder": "",\n  "field_one_calculation": 0,\n  "field_two_calculation": 0,\n  "calculation_units": "",\n  "calculation_operator": "",\n  "calculation_type": "",\n  "calculation_allow_negatives": 0,\n  "hide_input_characters": 0,\n  "remove_data_from_emails": 0,\n  "require_confirmation": 0,\n  "confirmationText": "",\n  "restrict_data_access": 0\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'warn',
          fieldId: '151757196',
          message: "No label for type: 'text', fieldId: '151757196'.",
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151757231',
          message:
            'fieldId: 151757231, type: radio, json: <pre><code>{\n  "logic": null,\n  "id": "151757231",\n  "label": "One Option",\n  "hide_label": "0",\n  "description": "",\n  "name": "one_option",\n  "type": "radio",\n  "options": [\n    {\n      "label": "Option1",\n      "value": "Option1",\n      "imageUrl": null\n    }\n  ],\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "4",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "option_layout": "vertical",\n  "option_other": 0,\n  "randomize_options": 0,\n  "option_store": "value",\n  "option_show_values": 0,\n  "use_images": 0,\n  "image_dimensions": "customDimensions",\n  "image_height": 100,\n  "image_width": 100,\n  "lock_image_ratio": true,\n  "lock_image_ratio_option": "fitProportionally",\n  "image_label_alignment": "bottom"\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'warn',
          fieldId: '151757231',
          message: 'Select options have 1 options.',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151757248',
          message:
            'fieldId: 151757248, type: radio, json: <pre><code>{\n  "logic": null,\n  "id": "151757248",\n  "label": "Empty Option",\n  "hide_label": "0",\n  "description": "",\n  "name": "empty_option",\n  "type": "radio",\n  "options": [\n    {\n      "label": "",\n      "value": "",\n      "imageUrl": null\n    },\n    {\n      "label": "Option1",\n      "value": "Option1",\n      "imageUrl": ""\n    }\n  ],\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "5",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "option_layout": "vertical",\n  "option_other": 0,\n  "randomize_options": 0,\n  "option_store": "value",\n  "option_show_values": 0,\n  "use_images": 0,\n  "image_dimensions": "customDimensions",\n  "image_height": 100,\n  "image_width": 100,\n  "lock_image_ratio": true,\n  "lock_image_ratio_option": "fitProportionally",\n  "image_label_alignment": "bottom"\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151757283',
          message:
            'fieldId: 151757283, type: radio, json: <pre><code>{\n  "logic": null,\n  "id": "151757283",\n  "label": "No Options",\n  "hide_label": "0",\n  "description": "",\n  "name": "no_options",\n  "type": "radio",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "6",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "option_layout": "vertical",\n  "option_other": 0,\n  "randomize_options": 0,\n  "option_store": "value",\n  "option_show_values": 0,\n  "use_images": 0,\n  "image_dimensions": "customDimensions",\n  "image_height": 100,\n  "image_width": 100,\n  "lock_image_ratio": true,\n  "lock_image_ratio_option": "fitProportionally",\n  "image_label_alignment": "bottom"\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'warn',
          fieldId: '151757283',
          message: 'Select options have 0 options.',
          relatedFieldIds: [],
        },
        {
          severity: 'warn',
          fieldId: null,
          message: 'label: "Duplicate Label Thrice" is used 3 times.',
          relatedFieldIds: ['151757114', '151757116', '151757119'],
        },
      ]);
    });
    it('Should return messages for all known form issues and workflow issues if the form is a workflow form.', () => {
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(
          workflowJson5456833 as unknown as TApiFormJson
        )
      );
      const knownIssues = formAnalytic.findKnownSetupIssues();
      expect(knownIssues).toStrictEqual([
        {
          severity: 'info',
          fieldId: null,
          message: 'Form/Workflow type: "workflow".',
          relatedFieldIds: [],
        },
        {
          severity: 'info',
          fieldId: null,
          message: 'Total Fields: 9.',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773737',
          message:
            'fieldId: 151773737, type: text, json: <pre><code>{\n  "logic": null,\n  "id": "151773737",\n  "label": "Short Answer",\n  "hide_label": "0",\n  "description": "",\n  "name": "short_answer",\n  "type": "text",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "1",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "text_size": 50,\n  "minlength": 0,\n  "maxlength": 0,\n  "placeholder": "",\n  "field_one_calculation": 0,\n  "field_two_calculation": 0,\n  "calculation_units": "",\n  "calculation_operator": "",\n  "calculation_type": "",\n  "calculation_allow_negatives": 0,\n  "hide_input_characters": 0,\n  "remove_data_from_emails": 0,\n  "require_confirmation": 0,\n  "confirmationText": "",\n  "restrict_data_access": 0\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773741',
          message:
            'fieldId: 151773741, type: checkbox, json: <pre><code>{\n  "logic": null,\n  "id": "151773741",\n  "label": "CheckTrueOrFalse(1)",\n  "hide_label": "0",\n  "description": "",\n  "name": "checktrueorfalse1",\n  "type": "checkbox",\n  "options": [\n    {\n      "label": "True",\n      "value": "True",\n      "imageUrl": null\n    },\n    {\n      "label": "False",\n      "value": "False",\n      "imageUrl": null\n    }\n  ],\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "2",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "option_layout": "vertical",\n  "option_other": 0,\n  "option_checkall": 0,\n  "randomize_options": 0,\n  "option_store": "value",\n  "option_show_values": 0,\n  "use_images": 0,\n  "image_dimensions": "customDimensions",\n  "image_height": 100,\n  "image_width": 100,\n  "lock_image_ratio": true,\n  "lock_image_ratio_option": "fitProportionally",\n  "image_label_alignment": "bottom",\n  "hide_option_button": true\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773738',
          message:
            'fieldId: 151773738, type: text, json: <pre><code>{\n  "logic": null,\n  "id": "151773738",\n  "label": "Short Answer",\n  "hide_label": "0",\n  "description": "",\n  "name": "short_answer",\n  "type": "text",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "4",\n  "calculation": "",\n  "workflow_access": "hidden",\n  "default": "",\n  "text_size": 50,\n  "minlength": 0,\n  "maxlength": 0,\n  "placeholder": "",\n  "field_one_calculation": 0,\n  "field_two_calculation": 0,\n  "calculation_units": "",\n  "calculation_operator": "",\n  "calculation_type": "",\n  "calculation_allow_negatives": 0,\n  "hide_input_characters": 0,\n  "remove_data_from_emails": 0,\n  "require_confirmation": 0,\n  "confirmationText": "",\n  "restrict_data_access": 0\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773756',
          message:
            'fieldId: 151773756, type: checkbox, json: <pre><code>{\n  "logic": null,\n  "id": "151773756",\n  "label": "CheckTrueOrFalse(2)",\n  "hide_label": "0",\n  "description": "",\n  "name": "checktrueorfalse2",\n  "type": "checkbox",\n  "options": [\n    {\n      "label": "True",\n      "value": "True",\n      "imageUrl": null\n    },\n    {\n      "label": "False",\n      "value": "False",\n      "imageUrl": null\n    }\n  ],\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "5",\n  "calculation": "",\n  "workflow_access": "hidden",\n  "default": "",\n  "option_layout": "vertical",\n  "option_other": 0,\n  "option_checkall": 0,\n  "randomize_options": 0,\n  "option_store": "value",\n  "option_show_values": 0,\n  "use_images": 0,\n  "image_dimensions": "customDimensions",\n  "image_height": 100,\n  "image_width": 100,\n  "lock_image_ratio": true,\n  "lock_image_ratio_option": "fitProportionally",\n  "image_label_alignment": "bottom",\n  "hide_option_button": true\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773739',
          message:
            'fieldId: 151773739, type: text, json: <pre><code>{\n  "logic": null,\n  "id": "151773739",\n  "label": "Short Answer",\n  "hide_label": "0",\n  "description": "",\n  "name": "short_answer",\n  "type": "text",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "7",\n  "calculation": "",\n  "workflow_access": "hidden",\n  "default": "",\n  "text_size": 50,\n  "minlength": 0,\n  "maxlength": 0,\n  "placeholder": "",\n  "field_one_calculation": 0,\n  "field_two_calculation": 0,\n  "calculation_units": "",\n  "calculation_operator": "",\n  "calculation_type": "",\n  "calculation_allow_negatives": 0,\n  "hide_input_characters": 0,\n  "remove_data_from_emails": 0,\n  "require_confirmation": 0,\n  "confirmationText": "",\n  "restrict_data_access": 0\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773757',
          message:
            'fieldId: 151773757, type: checkbox, json: <pre><code>{\n  "logic": null,\n  "id": "151773757",\n  "label": "CheckTrueOrFalse(3)",\n  "hide_label": "0",\n  "description": "",\n  "name": "checktrueorfalse3",\n  "type": "checkbox",\n  "options": [\n    {\n      "label": "True",\n      "value": "True",\n      "imageUrl": null\n    },\n    {\n      "label": "False",\n      "value": "False",\n      "imageUrl": null\n    }\n  ],\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "8",\n  "calculation": "",\n  "workflow_access": "hidden",\n  "default": "",\n  "option_layout": "vertical",\n  "option_other": 0,\n  "option_checkall": 0,\n  "randomize_options": 0,\n  "option_store": "value",\n  "option_show_values": 0,\n  "use_images": 0,\n  "image_dimensions": "customDimensions",\n  "image_height": 100,\n  "image_width": 100,\n  "lock_image_ratio": true,\n  "lock_image_ratio_option": "fitProportionally",\n  "image_label_alignment": "bottom",\n  "hide_option_button": true\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'warn',
          fieldId: null,
          message: 'label: "The Section Heading" is used 3 times.',
          relatedFieldIds: ['151773730', '151773733', '151773732'],
        },
        {
          severity: 'warn',
          fieldId: null,
          message: 'label: "Short Answer" is used 3 times.',
          relatedFieldIds: ['151773737', '151773738', '151773739'],
        },
      ]);
    });
    it("Should return messages for all known form issues and workflow issues if the form is a workflow form and the form's fields are not in the correct order.", () => {
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(
          workflowJson5456833 as unknown as TApiFormJson
        )
      );
      const knownIssues = formAnalytic.findKnownSetupIssues();
      expect(knownIssues).toStrictEqual([
        {
          severity: 'info',
          fieldId: null,
          message: 'Form/Workflow type: "workflow".',
          relatedFieldIds: [],
        },
        {
          severity: 'info',
          fieldId: null,
          message: 'Total Fields: 9.',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773737',
          message:
            'fieldId: 151773737, type: text, json: <pre><code>{\n  "logic": null,\n  "id": "151773737",\n  "label": "Short Answer",\n  "hide_label": "0",\n  "description": "",\n  "name": "short_answer",\n  "type": "text",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "1",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "text_size": 50,\n  "minlength": 0,\n  "maxlength": 0,\n  "placeholder": "",\n  "field_one_calculation": 0,\n  "field_two_calculation": 0,\n  "calculation_units": "",\n  "calculation_operator": "",\n  "calculation_type": "",\n  "calculation_allow_negatives": 0,\n  "hide_input_characters": 0,\n  "remove_data_from_emails": 0,\n  "require_confirmation": 0,\n  "confirmationText": "",\n  "restrict_data_access": 0\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773741',
          message:
            'fieldId: 151773741, type: checkbox, json: <pre><code>{\n  "logic": null,\n  "id": "151773741",\n  "label": "CheckTrueOrFalse(1)",\n  "hide_label": "0",\n  "description": "",\n  "name": "checktrueorfalse1",\n  "type": "checkbox",\n  "options": [\n    {\n      "label": "True",\n      "value": "True",\n      "imageUrl": null\n    },\n    {\n      "label": "False",\n      "value": "False",\n      "imageUrl": null\n    }\n  ],\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "2",\n  "calculation": "",\n  "workflow_access": "write",\n  "default": "",\n  "option_layout": "vertical",\n  "option_other": 0,\n  "option_checkall": 0,\n  "randomize_options": 0,\n  "option_store": "value",\n  "option_show_values": 0,\n  "use_images": 0,\n  "image_dimensions": "customDimensions",\n  "image_height": 100,\n  "image_width": 100,\n  "lock_image_ratio": true,\n  "lock_image_ratio_option": "fitProportionally",\n  "image_label_alignment": "bottom",\n  "hide_option_button": true\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773738',
          message:
            'fieldId: 151773738, type: text, json: <pre><code>{\n  "logic": null,\n  "id": "151773738",\n  "label": "Short Answer",\n  "hide_label": "0",\n  "description": "",\n  "name": "short_answer",\n  "type": "text",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "4",\n  "calculation": "",\n  "workflow_access": "hidden",\n  "default": "",\n  "text_size": 50,\n  "minlength": 0,\n  "maxlength": 0,\n  "placeholder": "",\n  "field_one_calculation": 0,\n  "field_two_calculation": 0,\n  "calculation_units": "",\n  "calculation_operator": "",\n  "calculation_type": "",\n  "calculation_allow_negatives": 0,\n  "hide_input_characters": 0,\n  "remove_data_from_emails": 0,\n  "require_confirmation": 0,\n  "confirmationText": "",\n  "restrict_data_access": 0\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773756',
          message:
            'fieldId: 151773756, type: checkbox, json: <pre><code>{\n  "logic": null,\n  "id": "151773756",\n  "label": "CheckTrueOrFalse(2)",\n  "hide_label": "0",\n  "description": "",\n  "name": "checktrueorfalse2",\n  "type": "checkbox",\n  "options": [\n    {\n      "label": "True",\n      "value": "True",\n      "imageUrl": null\n    },\n    {\n      "label": "False",\n      "value": "False",\n      "imageUrl": null\n    }\n  ],\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "5",\n  "calculation": "",\n  "workflow_access": "hidden",\n  "default": "",\n  "option_layout": "vertical",\n  "option_other": 0,\n  "option_checkall": 0,\n  "randomize_options": 0,\n  "option_store": "value",\n  "option_show_values": 0,\n  "use_images": 0,\n  "image_dimensions": "customDimensions",\n  "image_height": 100,\n  "image_width": 100,\n  "lock_image_ratio": true,\n  "lock_image_ratio_option": "fitProportionally",\n  "image_label_alignment": "bottom",\n  "hide_option_button": true\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773739',
          message:
            'fieldId: 151773739, type: text, json: <pre><code>{\n  "logic": null,\n  "id": "151773739",\n  "label": "Short Answer",\n  "hide_label": "0",\n  "description": "",\n  "name": "short_answer",\n  "type": "text",\n  "options": "",\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "7",\n  "calculation": "",\n  "workflow_access": "hidden",\n  "default": "",\n  "text_size": 50,\n  "minlength": 0,\n  "maxlength": 0,\n  "placeholder": "",\n  "field_one_calculation": 0,\n  "field_two_calculation": 0,\n  "calculation_units": "",\n  "calculation_operator": "",\n  "calculation_type": "",\n  "calculation_allow_negatives": 0,\n  "hide_input_characters": 0,\n  "remove_data_from_emails": 0,\n  "require_confirmation": 0,\n  "confirmationText": "",\n  "restrict_data_access": 0\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'debug',
          fieldId: '151773757',
          message:
            'fieldId: 151773757, type: checkbox, json: <pre><code>{\n  "logic": null,\n  "id": "151773757",\n  "label": "CheckTrueOrFalse(3)",\n  "hide_label": "0",\n  "description": "",\n  "name": "checktrueorfalse3",\n  "type": "checkbox",\n  "options": [\n    {\n      "label": "True",\n      "value": "True",\n      "imageUrl": null\n    },\n    {\n      "label": "False",\n      "value": "False",\n      "imageUrl": null\n    }\n  ],\n  "required": "0",\n  "uniq": "0",\n  "hidden": "0",\n  "readonly": "0",\n  "colspan": "1",\n  "sort": "8",\n  "calculation": "",\n  "workflow_access": "hidden",\n  "default": "",\n  "option_layout": "vertical",\n  "option_other": 0,\n  "option_checkall": 0,\n  "randomize_options": 0,\n  "option_store": "value",\n  "option_show_values": 0,\n  "use_images": 0,\n  "image_dimensions": "customDimensions",\n  "image_height": 100,\n  "image_width": 100,\n  "lock_image_ratio": true,\n  "lock_image_ratio_option": "fitProportionally",\n  "image_label_alignment": "bottom",\n  "hide_option_button": true\n}</code></pre>',
          relatedFieldIds: [],
        },
        {
          severity: 'warn',
          fieldId: null,
          message: 'label: "The Section Heading" is used 3 times.',
          relatedFieldIds: ['151773730', '151773733', '151773732'],
        },
        {
          severity: 'warn',
          fieldId: null,
          message: 'label: "Short Answer" is used 3 times.',
          relatedFieldIds: ['151773737', '151773738', '151773739'],
        },
      ]);
    });
    it('Should return messages formJson has no fields defined.', () => {
      const fieldlessPojo = jsonTransformers.formJson(
        formJson5456371 as unknown as TApiFormJson
      );
      // @ts-ignore - null is not correct type - but that's the subject of the test
      fieldlessPojo.fields = null;

      const formAnalytic = new FormAnalyticService(fieldlessPojo);
      const knownIssues = formAnalytic.findKnownSetupIssues();
      expect(knownIssues).toStrictEqual([
        {
          severity: 'info',
          fieldId: null,
          message: 'Form/Workflow type: "form".',
          relatedFieldIds: [],
        },
        {
          severity: 'info',
          fieldId: null,
          message: 'fieldJson.fields is non array.',
          relatedFieldIds: [],
        },
      ]);
    });
  });
  describe('.formId', () => {
    it('Should return the fieldId of the field', () => {
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(formJson5456371 as unknown as TApiFormJson)
      );
      expect(formAnalytic.formId).toBe('5456371');
    });
  });
  describe('.isActive', () => {
    it('Should return true if the form is active.', () => {
      const activeFormJson = structuredClone(
        formJson5568576
      ) as unknown as TApiFormJson;
      // @ts-ignore
      activeFormJson.inactive = true;
      const formAnalyticService = new FormAnalyticService(
        jsonTransformers.formJson(activeFormJson as unknown as TApiFormJson)
      );
      expect(formAnalyticService.isActive).toBe(false);
    });
    it('Should return false if the form is inactive.', () => {
      const inactiveFormJson = structuredClone(
        formJson5568576
      ) as unknown as TApiFormJson;

      //
      // @ts-ignore
      inactiveFormJson.inactive = false;
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(inactiveFormJson as unknown as TApiFormJson)
      );
      expect(formAnalytic.isActive).toBe(true);
    });
  });
  describe('.getAllFieldSummary()', () => {
    it('Should return a summary of all fields.', () => {
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(formJson5456371 as unknown as TApiFormJson)
      );
      expect(formAnalytic.getAllFieldSummary()).toStrictEqual({
        '151757114': {
          fieldId: '151757114',
          label: 'Duplicate Label Thrice',
          type: 'text',
        },
        '151757116': {
          fieldId: '151757116',
          label: 'Duplicate Label Thrice',
          type: 'text',
        },
        '151757119': {
          fieldId: '151757119',
          label: 'Duplicate Label Thrice',
          type: 'text',
        },
        '151757196': {
          fieldId: '151757196',
          label: '',
          type: 'text',
        },
        '151757231': {
          fieldId: '151757231',
          label: 'One Option',
          type: 'radio',
        },
        '151757248': {
          fieldId: '151757248',
          label: 'Empty Option',
          type: 'radio',
        },
        '151757283': {
          fieldId: '151757283',
          label: 'No Options',
          type: 'radio',
        },
      });
    });
  });
  describe('.getFieldIdsWithLogic()', () => {
    it('Should return a list of fieldIds with logic.', () => {
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(formJson5568576 as unknown as TApiFormJson)
      );
      const fieldIds = formAnalytic.getFieldIdsWithLogic();
      expect(formAnalytic.getFieldIdsWithLogic()).toStrictEqual([
        '156707806',
        '156707815',
        '156707816',
        '156707817',
        '156707818',
        '156707829',
        '156707830',
        '156707831',
        '156707832',
        '156707833',
        '156707834',
        '156707835',
      ]);
    });
  });

  describe('.getFieldIdsWithoutLogic()', () => {
    it('Should return a list of fieldIds with logic.', () => {
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(formJson5456371 as unknown as TApiFormJson)
      );
      const fieldIds = formAnalytic.getFieldIdsWithoutLogic();
      expect(fieldIds).toStrictEqual([
        '151757114',
        '151757116',
        '151757119',
        '151757196',
        '151757231',
        '151757248',
        '151757283',
      ]);
    });
  });
  describe('.getFieldIdsAll()', () => {
    it('Should return a list of all fieldIds.', () => {
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(formJson5456371 as unknown as TApiFormJson)
      );
      const fieldIds = formAnalytic.getFieldIdsAll();
      expect(fieldIds).toStrictEqual([
        '151757114',
        '151757116',
        '151757119',
        '151757196',
        '151757231',
        '151757248',
        '151757283',
      ]);
    });
  });
  describe('.getFieldIdsWithCircularReferences()', () => {
    it('Should return a list of fieldIds with circular references.', () => {
      const formAnalytic = new FormAnalyticService(
        jsonTransformers.formJson(formJson5568576 as unknown as TApiFormJson)
      );
      const fieldIds = formAnalytic.getFieldIdsWithCircularReferences();
      expect(fieldIds).toStrictEqual([
        '156707815',
        '156707816',
        '156707817',
        '156707818',
        '156707829',
        '156707830',
        '156707831',
        '156707832',
        '156707833',
        '156707834',
        '156707835',
      ]);
    });
  });
});
