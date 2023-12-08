import React, { ReactElement, useEffect, useState } from 'react';

interface CheckboxProps {
  labelText: string;
  value: string;
  checkboxId: string;
  isChecked: boolean;
}

interface Props {
  checkboxProps: CheckboxProps[];
}

const CheckboxArray: React.FC<Props> = ({ checkboxProps }: Props) => {
  return (
    <div>
      {checkboxProps.map((checkboxProp) => {
        return <div>{JSON.stringify(checkboxProp)}</div>;
      })}
    </div>
  );
};

export { CheckboxArray };
