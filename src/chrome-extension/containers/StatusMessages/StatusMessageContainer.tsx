import React from 'react';
import './StatusMessage.css';
import { TStatusRecord } from '../../../formstack/classes/Evaluator/type';

interface Props {
  statusMessage?: TStatusRecord[];
}

const StatusMessageContainer: React.FC<Props> = ({ statusMessage }: Props) => {
  return (
    <div className="OptionsContainer">
      {JSON.stringify(statusMessage || {})} Status Messages
    </div>
  );
};

export { StatusMessageContainer };
