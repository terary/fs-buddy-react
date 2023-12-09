import React from "react";
import { Checkbox } from "../Checkbox/Checkbox";
import styles from "./CheckboxArray.module.css";
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

  return (
    <div
      className={styles.checkboxArrayContainer}
      data-testid="checkbox-array-container"
    >
      {Object.entries(stateProps).map(([logType, checkboxProps]) => {
        return (
          <Checkbox
            key={logType}
            valueKey={logType}
            label={checkboxProps.label}
            onChange={handleCheckboxChangeChange}
            value={checkboxProps.value}
            initialValue={checkboxProps.value}
          />
        );
      })}
      {/* <code>
        <pre>{JSON.stringify(stateProps, null, 2)}</pre>
      </code> */}
    </div>
  );
};

export { CheckboxArray };
