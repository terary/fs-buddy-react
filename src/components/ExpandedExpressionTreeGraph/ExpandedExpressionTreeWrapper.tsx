import React, { useState, useEffect, useContext } from 'react';
import ExpandedExpressionTreeGraph from './ExpandedExpressionTreeGraph';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';

import {
  UIStateContext,
  UIStateDispatch,
} from '../../chrome-extension/AppState';
type LabelOptionsType = 'label' | 'fieldId' | 'nodeId' | 'nodeIdExt';

const ExpandedExpressionTreeWrapper = () => {
  const dispatcher = useContext(UIStateDispatch);
  const uiStateContext = useContext(UIStateContext);

  const { logicalNodeGraphMap } = uiStateContext.logicFieldSelected;
  const [nodeLabelType, setNodeLabelType] = useState(
    'label' as LabelOptionsType
  );

  const handleLabelOptionChange = (evt: RadioButtonChangeEvent) => {
    setNodeLabelType(evt.value.key);
    console.log({ handleLabelOptionChange: { key: evt.value.key, evt } });
  };

  const ExpandedTree = () => {
    return (
      <div>
        <div className="card flex justify-content-center">
          <div style={{ padding: '15px' }} className="flex flex-column gap-3">
            {['fieldId', 'nodeId', 'nodeIdExt', 'label'].map((labelOption) => {
              const opt = { key: labelOption, name: labelOption };
              return (
                <div
                  key={opt.key}
                  style={{ padding: '10px', display: 'inline' }}
                  className="flex align-items-center"
                >
                  <RadioButton
                    inputId={opt.key}
                    name="category"
                    value={opt}
                    onChange={handleLabelOptionChange}
                    checked={nodeLabelType === opt.key}
                  />
                  <label htmlFor={opt.key} className="ml-2">
                    {opt.name}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <ExpandedExpressionTreeGraph
          height={500}
          width={700}
          labelBy={nodeLabelType}
          data={uiStateContext.logicFieldSelected.logicalNodeGraphMap || []}
        />
      </div>
    );
  };

  return logicalNodeGraphMap &&
    Array.isArray(logicalNodeGraphMap) &&
    logicalNodeGraphMap.length > 0 ? (
    <ExpandedTree />
  ) : (
    <EmptyTree />
  );
};

const EmptyTree = () => {
  return (
    <div style={{ paddingTop: '10px' }}>
      <span>No Logic Available.</span>
    </div>
  );
};

export { ExpandedExpressionTreeWrapper };

const ExtendedTreeGraphWrapper = () => {};
