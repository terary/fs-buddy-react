import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Props {
  options: {
    value: string;
    label: string;
  }[];
  onFieldIdSelected: (fieldId: string) => void;
}

const LogicFieldSelect = ({ options, onFieldIdSelected }: Props) => {
  const [selectedValue, setSelectedValue] = useState(options[0]?.value || '');

  const handleOptionSelected = (e: DropdownChangeEvent) => {
    const fieldId = e.target.value;
    console.log({ changeEvent: e, fieldId });

    setSelectedValue(fieldId);
    onFieldIdSelected(fieldId);
  };

  return (
    <>
      <label htmlFor="logicFieldSelect">Select Root Logic Field:</label>
      <br />
      <Dropdown
        id="logicFieldSelect"
        value={selectedValue}
        onChange={handleOptionSelected}
        options={options || []}
        optionValue="value"
        optionLabel="label"
        placeholder="Select field"
        className="w-full md:w-14rem"
      />
    </>
  );
};

export { LogicFieldSelect };
