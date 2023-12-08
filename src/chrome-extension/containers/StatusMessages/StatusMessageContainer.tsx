import React from 'react';
import './StatusMessage.css';
import { TStatusRecord } from '../../../formstack/classes/Evaluator/type';

interface Props {
  statusMessages?: TStatusRecord[];
}

const StatusMessageContainer: React.FC<Props> = ({ statusMessages }: Props) => {
  return (
    <div
      style={{
        height: '200px',
        width: '500px',
        overflowY: 'auto',
        border: '1px solid black',
        textAlign: 'left',
      }}
    >
      <h3>Status Messages</h3>
      {(statusMessages || [])
        .filter((statusMessages) => statusMessages.severity !== 'debug')
        .map((statusMessage) => {
          return (
            <div style={{ display: 'block' }}>
              severity: ({statusMessage.severity})<br />
              fieldId: {statusMessage.fieldId}
              message: {statusMessage.message}
              <br />
              related fields:{statusMessage.relatedFieldIds || '[]'}
            </div>
          );
        })}
      {(statusMessages || [])
        .filter((statusMessages) => statusMessages.severity === 'debug')
        .map((statusMessage) => {
          console.log({ x: statusMessage });
          // @ts-ignore
          return (
            <div style={{ display: 'block', textAlign: 'left' }}>
              severity: ({statusMessage.severity})<br />
              fieldId: {statusMessage.fieldId}
              <br />
              related fields: {statusMessage.relatedFieldIds || '[]'}
              <br />
              <div
                dangerouslySetInnerHTML={{ __html: statusMessage.message }}
              />
              <br />
            </div>
          );
        })}
    </div>
  );
};

export { StatusMessageContainer };
