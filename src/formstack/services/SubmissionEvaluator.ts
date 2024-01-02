import type { TFsFieldAny, TSubmissionJson } from '../../formstack';

import { FsFormModel, Evaluator } from '../../formstack';

type TUiSubmissionDataItem = {
  uiid: string;
  fieldId: string;
  fieldType: string; // known type
  value: string;
};

class SubmissionEvaluator {
  private _fieldCollection: FsFormModel;
  constructor(fieldCollection: FsFormModel) {
    this._fieldCollection = fieldCollection;
  }

  private get fieldCollection() {
    return this._fieldCollection;
  }

  getPopulateUiArray(submission: TSubmissionJson): TUiSubmissionDataItem[] {
    /**
     *Get Evalua
     */
    submission.data.map((datum) => {
      const fieldTree = this.fieldCollection.getFieldModel(datum.fieldId);
      const evaluator = Evaluator.getEvaluatorWithFieldJson(
        fieldTree?.fieldJson as TFsFieldAny
      );
      return evaluator.getUiPopulateObjects({ [datum.fieldId]: datum.value });
    });

    return [];
  }
}

export { SubmissionEvaluator };
