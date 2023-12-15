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
  const handleOptionSelected2 = (e: DropdownChangeEvent) => {
    const fieldId = e.target.value;
    console.log({ changeEvent: e, fieldId });

    setSelectedValue(fieldId);
    onFieldIdSelected(fieldId);
  };

  const handleOptionSelected = (e: SyntheticEvent) => {
    // @ts-ignore
    const fieldId = e.target.value;
    console.log({ changeEvent: e, fieldId });

    onFieldIdSelected(fieldId);
  };

  return (
    <>
      <Dropdown
        value={selectedValue}
        onChange={handleOptionSelected2}
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
