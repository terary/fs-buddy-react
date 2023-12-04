import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';

interface Props {
  options: {
    value: string;
    label: string;
  }[];
  onFieldIdSelected: (fieldId: string) => void;
}

const LogicFieldSelect = ({ options, onFieldIdSelected }: Props) => {
  const handleOptionSelected = (e: SyntheticEvent) => {
    // @ts-ignore
    const fieldId = e.target.value;
    console.log({ changeEvent: e, fieldId });

    onFieldIdSelected(fieldId);
  };

  return (
    <select onChange={handleOptionSelected}>
      {(options || []).map((option) => {
        return (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
};

export { LogicFieldSelect };
