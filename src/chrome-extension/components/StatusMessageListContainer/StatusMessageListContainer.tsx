import React from 'react';
import styles from './StatusMessageListContainer.module.css';
import { StatusMessageContainer } from './StatusMessageContainer';
import { TStatusRecord } from '../../../formstack';

interface Props {
  statusMessages?: TStatusRecord[];
}

const StatusMessageListContainer = ({ statusMessages = [] }: Props) => {
  return (
    <div className={styles.statusMessageListContainer}>
      {statusMessages.map((message) => {
        return <StatusMessageContainer statusMessage={message} />;
      })}
    </div>
  );
};

export { StatusMessageListContainer };
