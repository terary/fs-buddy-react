import React, { ReactNode } from 'react';
import styles from './Checkbox.module.css';
interface Props {
  label: string;
  valueKey: string; // will emit {[valueKey]: true | false}
  value?: boolean;

  initialValue?: boolean;
  //children: ReactNode; // as React.FC declares it for you, just delete this line
  onChange?: ({
    valueKey,
    isChecked,
  }: {
    valueKey: string;
    isChecked: boolean;
  }) => void;
  children?: any;
}

// const ApiKeyContainer: React.FC<Props> = ({
//   apiKey,
//   formId,
//   onChange,
// }: Props) => {

// const App: React.FC = () => {
const Checkbox: React.FC<Props> = ({
  label,
  valueKey,
  onChange,
  value,
  initialValue = true,
  children,
}: Props) => {
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
