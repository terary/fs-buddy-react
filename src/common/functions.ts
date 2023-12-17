import { TStatusRecord } from '../components/StatusMessageListContainer/type';
import { TStatusMessageSeverity } from '../formstack/classes/Evaluator/type';

const filterStatusMessages = (
  statusMessages: TStatusRecord[] = [],
  logLevels: TStatusMessageSeverity[] = [],
  searchText?: string
): TStatusRecord[] => {
  const filteredMessages = statusMessages.filter((statusMessage) =>
    logLevels.includes(statusMessage.severity)
  );

  // if (searchText !== undefined) {
  //   const searchRegExp = new RegExp(searchText.replace(/[\W\S]/, ''), 'i');
  //   return filteredMessages.filter((statusMessage) => {
  //     const isMatch = searchRegExp.test(JSON.stringify(statusMessage));
  //     return isMatch;
  //   });
  // }
  return filteredMessages;
  // return statusMessages;
};

export { filterStatusMessages };
