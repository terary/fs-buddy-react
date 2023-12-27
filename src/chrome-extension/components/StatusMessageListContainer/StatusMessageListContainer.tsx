import React from 'react';
// @ts-ignore doesn't like the import but it seems to compile fine
import styles from './StatusMessageListContainer.module.css';
import { TStatusRecord } from './type';
import { StatusMessageContainer } from './StatusMessageContainer';

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
