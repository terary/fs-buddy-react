import React, { useContext } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { actions, UIStateContext, UIStateDispatch } from '../../AppState';

const groupedItemTemplate = (option: any) => {
  return (
    <div className="flex align-items-center">
      <div>{option.label}</div>
    </div>
  );
};
// { options, onFieldIdSelected }: Props
const LogicFieldSelect = () => {
  const dispatcher = useContext(UIStateDispatch);
  const uiStateContext = useContext(UIStateContext);
  const groupedCities = [
    {
      label: 'Notification Emails',
      code: 'NOTIFICATION_EMAILS',
      items: uiStateContext?.offFormLogic.notificationEmails,
    },
    {
      label: 'Webhooks',
      code: 'WEBHOOKS',
      items: uiStateContext?.offFormLogic.webhooks,
    },
    {
      label: 'Confirmation Emails',
      code: 'CONFIRMATION_EMAILS',
      items: uiStateContext?.offFormLogic.confirmationEmails,
    },
    {
      label: 'Fields',
      code: 'FIELDS',
      items: uiStateContext?.offFormLogic.formLogic,
    },
  ];

  const handleLogicItemSelected = (evt: DropdownChangeEvent) => {
    const newSelectLogicItem =
      uiStateContext?.offFormLogic?.allOffFormLogic.find((logicItem) => {
        return logicItem.id == evt.value;
      });

    dispatcher(
      actions.logic.updateSelectedField(uiStateContext, {
        logicalNodeGraphMap: newSelectLogicItem?.graphMap,
        // this needs to be address, offForm logic won't have this, is it being used?
        fieldId: newSelectLogicItem?.name,
        statusMessages: newSelectLogicItem?.statusMessages,
        allLogicId: newSelectLogicItem?.id,
      })
    );
  };
  return (
    <div className="card flex justify-content-center">
      <Dropdown
        filter
        value={uiStateContext.logicFieldSelected.allLogicId}
        onChange={handleLogicItemSelected}
        options={groupedCities}
        optionLabel="name"
        optionValue="id"
        optionGroupLabel="label"
        optionGroupChildren="items"
        optionGroupTemplate={groupedItemTemplate}
        className="w-full md:w-14rem"
        placeholder="Select Root Logic"
      />
    </div>
  );
};

export { LogicFieldSelect };
