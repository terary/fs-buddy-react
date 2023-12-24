import { TFsFieldLogicJunctionJson } from '../../formstack/classes/subtrees/types';
import { TApiFormJson } from './type.form';

type TApiWebHookJson = {
  logic: TFsFieldLogicJunctionJson; // TFsFieldLogicJunction<TFsJunctionOperators>; // ?
  name: string;
  id: string;
  formId: string;
};
type TApiConfirmationEmailJson = TApiWebHookJson;
type TApiNotificationEmailJson = TApiWebHookJson;

const getFormJsonFromApi = async (message: any): Promise<TApiFormJson> => {
  return getFromJsonApi<TApiFormJson>(message);
};

const getWebhookJsonFromApi = async (
  message: any
): Promise<TApiWebHookJson> => {
  return getFromJsonApi<TApiWebHookJson>(message, '/webhook.json');
};

const getConfirmationEmailJsonFromApi = async (
  message: any
): Promise<TApiWebHookJson> => {
  return getFromJsonApi<TApiWebHookJson>(message, '/confirmation.json');
};

const getNotificationEmailJsonFromApi = async (
  message: any
): Promise<TApiWebHookJson> => {
  return getFromJsonApi<TApiWebHookJson>(message, '/notification.json');
};

const getFromJsonApi = async <T>(message: any, endpoint = ''): Promise<T> => {
  const { apiKey, formId } = message;

  return new Promise((resolve, reject) => {
    if (!apiKey || !formId) {
      throw new Error(`apiKey: '${apiKey}' or formId: '${formId}'.`);
    }

    const formGetUrl =
      `https://www.formstack.com/api/v2/form/${formId}` + endpoint;

    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${apiKey}`);
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(formGetUrl, requestOptions)
      .then((response) => {
        return response.text();
      })
      .then((result) => {
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          reject(e);
        }
      })
      .catch((error) => reject(error));
  });
};

class TreeManager {
  // static #instance: TreeManager;
  private static instance: TreeManager;

  private _formTrees: { [formId: string]: TApiFormJson } = {};
  private _webhooks: { [formId: string]: TApiWebHookJson } = {};
  private _notificationEmail: { [formId: string]: TApiNotificationEmailJson } =
    {};
  private _confirmationEmail: { [formId: string]: TApiConfirmationEmailJson } =
    {};
  //  private _fieldLogicService!: FieldLogicService;
  private constructor() {}

  addTree(fieldId: string, formJson: TApiFormJson) {
    this._formTrees[fieldId] = formJson;
  }

  // getFieldLogicService() {
  //   return this._fieldLogicService;
  // }

  async getTree(apiKey: string, formId: string): Promise<TApiFormJson> {
    if (this._formTrees[formId]) {
      return Promise.resolve(this._formTrees[formId]);
    } else {
      const formJson = await getFormJsonFromApi({ apiKey, formId });
      this._formTrees[formId] = formJson;
      // this._fieldLogicService =
      //   FormstackBuddy.getInstance().getFieldLogicService(
      //     formJson.fields || []
      //   );

      return this._formTrees[formId];
    }
  }

  async getWebhookJson(apiKey: string, formId: string) {
    if (this._webhooks[formId]) {
      return Promise.resolve(this._webhooks[formId]);
    } else {
      const formJson = await getWebhookJsonFromApi({ apiKey, formId });
      this._webhooks[formId] = formJson;
      return this._webhooks[formId];
    }
  }

  async getConfirmationEmailJson(apiKey: string, formId: string) {
    if (this._confirmationEmail[formId]) {
      return Promise.resolve(this._confirmationEmail[formId]);
    } else {
      const formJson = await getConfirmationEmailJsonFromApi({
        apiKey,
        formId,
      });
      this._confirmationEmail[formId] = formJson;
      return this._confirmationEmail[formId];
    }
  }

  async getNotificationEmailJson(apiKey: string, formId: string) {
    if (this._notificationEmail[formId]) {
      return Promise.resolve(this._notificationEmail[formId]);
    } else {
      const formJson = await getNotificationEmailJsonFromApi({
        apiKey,
        formId,
      });
      this._notificationEmail[formId] = formJson;
      return this._notificationEmail[formId];
    }
  }

  static getInstance(): TreeManager {
    // if (!TreeManager.#instance) {
    //   TreeManager.#instance = new TreeManager();
    // }
    // return TreeManager.#instance;
    if (!TreeManager.instance) {
      TreeManager.instance = new TreeManager();
    }
    return TreeManager.instance;
  }
}

export { TreeManager };
