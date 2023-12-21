import React from "react";
import styles from "./Checkbox.module.css";
interface CheckboxProps {
  label: string;
  valueKey: string; // will emit {[valueKey]: true | false}
  value?: boolean;

  initialValue?: boolean;
  onChange?: ({
    valueKey,
    isChecked,
  }: {
    valueKey: string;
    isChecked: boolean;
  }) => void;
}

const Checkbox = ({
  label,
  valueKey,
  onChange,
  value,
  initialValue = true,
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = React.useState(initialValue);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = evt.target.checked;
    !onChange && setIsChecked(isChecked);
    onChange && onChange({ valueKey, isChecked });
  };

  return (
    <div className={styles.checkboxContainer}>
      <label>
        {label}
        <input
          data-testid="checkbox-input"
          type="checkbox"
          checked={value !== undefined ? value : isChecked}
          // checked={isChecked}
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export { Checkbox };
