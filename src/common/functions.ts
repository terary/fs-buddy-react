import type { TStatusMessageSeverity, TStatusRecord } from '../formstack';

const filterStatusMessages = (
  statusMessages: TStatusRecord[] = [],
  logLevels: TStatusMessageSeverity[] = [],
  searchText?: string
): TStatusRecord[] => {
  const filteredMessages = statusMessages.filter((statusMessage) =>
    logLevels.includes(statusMessage.severity)
  );

  return filteredMessages;
};

const keyIn = (key: string, obj: any) => obj !== undefined && key in obj;

export { filterStatusMessages, keyIn };
