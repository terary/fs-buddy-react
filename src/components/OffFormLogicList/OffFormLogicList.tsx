import React, { useState, useEffect, useContext } from 'react';
import { TFsNotificationEmailLogic } from '../../formstack/type.notification';
import {
  actions,
  UIStateContext,
  UIStateDispatch,
} from '../../chrome-extension/AppState';

import { TGraphNode } from '../../formstack/transformers/pojoToD3TableData';
import ExpandedExpressionTreeGraph from '../ExpandedExpressionTreeGraph/ExpandedExpressionTreeGraph';
import { TStatusRecord } from '../StatusMessageListContainer/type';

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

const OffFormLogicList: React.FC = () => {
  const dispatcher = useContext(UIStateDispatch);
  const uiStateContext = useContext(UIStateContext);
  const [selectedLogicItem, setSelectedLogicItem] = useState(
    uiStateContext?.offFormLogic?.allOffFormLogic[0] || {}
  );
  const handleOffFormLogicItemSelected = (evt: DropdownChangeEvent) => {
    const newSelectedNotification =
      uiStateContext?.offFormLogic?.allOffFormLogic.find((logicItem) => {
        return logicItem.id == evt.value;
      });
    console.log({
      handleOffFormLogicItemSelected: {
        statusMessages: newSelectedNotification?.statusMessages,
      },
    });
    dispatcher(
      actions.logic.updateSelectedField(uiStateContext, {
        logicalNodeGraphMap: newSelectedNotification?.graphMap,
        fieldId: newSelectedNotification?.name,
        statusMessages: newSelectedNotification?.statusMessages,
      })
    );
    // @ts-ignore - does not like the possible undefined
    setSelectedLogicItem(newSelectedNotification || {});
    console.log({
      handleOnNotificationSelected: {
        value: evt.value,
        newSelectedNotification,
        evt,
      },
    });
  };

  return (
    <div>
      uiStateContext.offFormLogic:{' '}
      {JSON.stringify(Object.keys(uiStateContext?.offFormLogic || {}))}
      <br />
      selectedLogicItem:{' '}
      {JSON.stringify(selectedLogicItem.statusMessages || {})}
      <br />
      {uiStateContext?.offFormLogic?.allOffFormLogic && (
        <Dropdown
          value={selectedLogicItem.id}
          onChange={handleOffFormLogicItemSelected}
          options={uiStateContext.offFormLogic.allOffFormLogic}
          optionLabel="name"
          optionValue="id"
          placeholder="Off Form Logic Entity"
          className="w-full md:w-14rem"
        />
      )}
      {Array.isArray(selectedLogicItem?.graphMap) &&
        selectedLogicItem?.graphMap.length > 0 && (
          <ExpandedExpressionTreeGraph
            height={500}
            width={600}
            data={selectedLogicItem.graphMap || []}
          />
        )}
    </div>
  );
};

export { OffFormLogicList };
