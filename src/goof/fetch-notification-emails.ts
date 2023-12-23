import { FsFormAsDirectedGraph } from './FsFormAsDirectedGraph';
import { ApiNotificationEmailCacheManager } from '../common/ApiNotificationEmailCacheManager';
import { ApiFormCacheManager } from '../common/ApiFormCacheManager';
import { FsFormModel, FsLogicTreeDeep } from '../formstack';
import { TFsFieldLogicJunctionJson } from '../formstack/classes/subtrees/types';

const apiKey = 'cc17435f8800943cc1abd3063a8fe44f';
const formId = '5375703';

const getDependencyList = (tree: FsFormAsDirectedGraph): any => {
  const theList: any = {};
  Object.values(tree.getChildFields()).forEach((field) => {
    theList[field.rootFieldId] = field.getDependencyFieldIds();
  });

  return theList;
};
const printNotification = (notification: any) => {
  const { action, conditional, checks } = notification.logic;
  console.log({ action, conditional, checks });
  checks.forEach((check: any) => {
    const { field, condition, option } = check;
    console.log({ field, condition, option });
  });
};

const TWO_CONFLICTING_ROOTS = 0;
const ONE_LEAF = 1;
const TWO_MUTUALLY_EXCLUSIVE_LOGIC_ROOTS = 2;
const WITH_NO_LOGIC = 3;

(async () => {
  const notificationJson =
    await ApiNotificationEmailCacheManager.getInstance().getTree(
      apiKey,
      formId
    );
  const formJson = await ApiFormCacheManager.getInstance().getTree(
    apiKey,
    formId
  );

  const formModel = FsFormModel.fromApiFormJson(formJson);

  const a = formModel.aggregateOffFormLogicJson(
    notificationJson.notifications[TWO_MUTUALLY_EXCLUSIVE_LOGIC_ROOTS].logic
  );

  const b = formModel.aggregateOffFormLogicJson(
    notificationJson.notifications[ONE_LEAF].logic
  );

  const c = formModel.aggregateOffFormLogicJson(
    notificationJson.notifications[WITH_NO_LOGIC].logic
  );

  const d = formModel.aggregateOffFormLogicJson(
    notificationJson.notifications[TWO_CONFLICTING_ROOTS].logic
  );

  console.log({
    getStatisticCounts: {
      TWO_MUTUALLY_EXCLUSIVE_LOGIC_ROOTS: a ? a.getStatisticCounts() : a,
      ONE_LEAF: b ? b.getStatisticCounts() : b,
      WITH_NO_LOGIC: c ? c.getStatisticCounts() : c,
      TWO_CONFLICTING_ROOTS: d ? d.getStatisticCounts() : d,
    },
  });

  const notification = notificationJson?.notifications[1];

  printNotification(notification);
  console.log('Thats all folks');
})();
