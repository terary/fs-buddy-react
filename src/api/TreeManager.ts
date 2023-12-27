import type { TApiFormJson, TFsFieldLogicJunctionJson } from '../formstack';
import { FieldLogicService, transformers } from '../formstack';

type TApiWebHookJson = {
  logic: TFsFieldLogicJunctionJson; // TFsFieldLogicJunction<TFsJunctionOperators>; // ?
  name: string;
  id: string;
  formId: string;
};

const getFormJsonFromApi = async (message: any): Promise<TApiFormJson> => {
  return getFromJsonApi<TApiFormJson>(message);
};

const getWebhookJsonFromApi = async (
  message: any
): Promise<TApiWebHookJson> => {
  return getFromJsonApi<TApiWebHookJson>(message, '/webhook.json');
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
  static #instance: TreeManager;

  private _formTrees: { [formId: string]: TApiFormJson } = {};
  private _webhooks: { [formId: string]: TApiWebHookJson } = {};

  private _fieldLogicService!: FieldLogicService;
  private constructor() {}

  addTree(fieldId: string, formJson: TApiFormJson) {
    this._formTrees[fieldId] = formJson;
  }

  getFieldLogicService() {
    return this._fieldLogicService;
  }

  async getTree(apiKey: string, formId: string): Promise<TApiFormJson> {
    if (this._formTrees[formId]) {
      return Promise.resolve(this._formTrees[formId]);
    } else {
      const formJson = await getFormJsonFromApi({ apiKey, formId });
      this._formTrees[formId] = formJson;
      this._fieldLogicService = new FieldLogicService(
        transformers.formJson(formJson)
      );
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

  static getInstance(): TreeManager {
    if (!TreeManager.#instance) {
      TreeManager.#instance = new TreeManager();
    }
    return TreeManager.#instance;
  }
}

export { TreeManager };
