import React, { useState } from 'react';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
interface CheckboxProps {
  label: string;
  value: boolean;
}
interface Props {
  props: { [checkboxKey: string]: CheckboxProps };
  onChange?: (currentValues: { [valueKey: string]: boolean }) => void;
}

const CheckboxArray = ({ props, onChange }: Props) => {
  const [stateProps, setStateProps] = React.useState(props);
  const handleCheckboxChangeChange = ({
    valueKey,
    isChecked,
  }: {
    valueKey: string;
    isChecked: boolean;
  }) => {
    console.log({ valueKey, isChecked });
    const newStateProps = {
      ...stateProps,
    };
    const newValue = { ...stateProps[valueKey], ...{ value: isChecked } };
    newStateProps[valueKey] = newValue;
    // @ts-ignore - ignore type
    onChange && onChange(newStateProps);
    setStateProps(newStateProps);
  };

  // '(props: CheckboxProps | Readonly<CheckboxProps>): Checkbox', gave the following error.
  // Type '(props: CheckboxProps | Readonly<CheckboxProps>) => void' is not assignable to type '(event: CheckboxChangeEvent) => void'.
  const handleCheckboxChangeChange2 = (event: CheckboxChangeEvent) => {
    console.log({ checkboxEvent: event });
    const newStateProps = {
      ...stateProps,
    };
    const { value: valueKey, checked: isChecked } = event;
    const newValue = {
      ...stateProps[valueKey],
      ...{ value: isChecked || false },
    };
    newStateProps[valueKey] = newValue;

    // @ts-ignore - ignore type
    onChange && onChange(newStateProps);
    setStateProps(newStateProps);
  };

  const [checked, setChecked] = useState(true);
  return (
    <div className="justify-content-end">
      {Object.entries(stateProps).map(([logType, checkboxProps]) => {
        return (
          <div
            key={logType}
            style={{ display: 'inline' }}
            className="flex align-items-center"
          >
            <Checkbox
              inputId={logType}
              name="category"
              value={logType}
              onChange={handleCheckboxChangeChange2}
              checked={checkboxProps.value}
            />
            <label htmlFor={logType} className="ml-2">
              {checkboxProps.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export { CheckboxArray };
