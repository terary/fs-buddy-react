import { ApiWebhookCacheManager } from '../api/ApiWebhookCacheManager';
import { ApiFormCacheManager } from '../api/ApiFormCacheManager';
import { FsFormModel, FsLogicTreeDeep } from '../formstack';

const apiKey = 'cc17435f8800943cc1abd3063a8fe44f';
const formId = '5375703';

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
  const webhookJson = await ApiWebhookCacheManager.getInstance().getTree(
    apiKey,
    formId
  );
  const formJson = await ApiFormCacheManager.getInstance().getTree(
    apiKey,
    formId
  );

  const formModel = FsFormModel.fromApiFormJson(formJson);

  const a = formModel.aggregateOffFormLogicJson(
    webhookJson.webhooks[TWO_MUTUALLY_EXCLUSIVE_LOGIC_ROOTS].logic
  );

  const b = formModel.aggregateOffFormLogicJson(
    webhookJson.webhooks[ONE_LEAF].logic
  );

  const c = formModel.aggregateOffFormLogicJson(
    webhookJson.webhooks[WITH_NO_LOGIC].logic
  );

  const d = formModel.aggregateOffFormLogicJson(
    webhookJson.webhooks[TWO_CONFLICTING_ROOTS].logic
  );

  console.log({
    webhookJson: JSON.stringify(webhookJson, null, 2),
    getStatisticCounts: {
      TWO_MUTUALLY_EXCLUSIVE_LOGIC_ROOTS: a ? a.getStatisticCounts() : a,
      ONE_LEAF: b ? b.getStatisticCounts() : b,
      WITH_NO_LOGIC: c ? c.getStatisticCounts() : c,
      TWO_CONFLICTING_ROOTS: d ? d.getStatisticCounts() : d,
    },
  });

  //  const notification = webhookJson?.notifications[1];

  //printNotification(notification);
  console.log('Thats all folks');
})();
