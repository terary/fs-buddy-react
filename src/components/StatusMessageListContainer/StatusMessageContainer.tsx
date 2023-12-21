import React from 'react';
// @ts-ignore - can't find this module but it compiles as expected
import styles from './StatusMessageContainer.module.css';

import { TStatusMessageSeverity, TStatusRecord } from './type';

interface Props {
  statusMessage: TStatusRecord;
}

const RelatedFields = ({
  relatedFieldIds,
}: {
  relatedFieldIds?: string[] | null;
}) => {
  if (!relatedFieldIds || relatedFieldIds.length === 0) {
    return <></>;
  }
  return (
    <div className={styles.relatedFieldsContainer}>
      <div className={styles.tableCell}>
        Related Fields:{' '}
        <span className={styles.relatedFieldIdsArray}>
          {relatedFieldIds.join(', ')}
        </span>
      </div>
    </div>
  );
};

const extractReplacePreCode = (potentialHtml: string = '') => {
  const begTagIndex = potentialHtml.search(/<pre>.*<code>/);
  const endTagIndex = potentialHtml.search('</pre>.*</code>');
  if (begTagIndex == -1 || endTagIndex == -1) {
    return potentialHtml;
  }

  return (
    potentialHtml.substring(0, begTagIndex) +
    potentialHtml.substring(begTagIndex + '<pre><code>'.length, endTagIndex) +
    potentialHtml.substring(endTagIndex + '</pre></code>'.length)
  );
};

const extractDebugMessage = (statusMessage: TStatusRecord) => {
  if (!statusMessage.message.match(/json/)) {
    <div
      dangerouslySetInnerHTML={{
        __html: extractReplacePreCode(statusMessage.message),
      }}
    ></div>;
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: statusMessage.message }}></div>
  );
  // const html = statusMessage.message.slice(
  //   statusMessage.message.indexOf('json:') + 5
  // );
  // return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

const StatusMessageContainer = ({ statusMessage }: Props) => {
  return (
    <div
      className={
        severityStyle(statusMessage.severity) +
        ' ' +
        styles.statusMessageContainer
      }
    >
      <div className={styles.tableCell}>({statusMessage.severity})</div>
      <div className={styles.tableCell}>
        {extractDebugMessage(statusMessage)}
      </div>
      <RelatedFields relatedFieldIds={statusMessage.relatedFieldIds} />
    </div>
  );
};

export { StatusMessageContainer };

const severityStyle = (severity: TStatusMessageSeverity): string => {
  switch (severity) {
    case 'debug':
      return styles.statusMessageDebug;
    case 'info':
      return styles.statusMessageInfo;
    case 'warn':
      return styles.statusMessageWarn;
    case 'error':
      return styles.statusMessageError;
    case 'logic':
      return styles.statusMessageLogic;
  }
};
