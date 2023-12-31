import { transformLogicJsonToOffFormLogic } from './transformLogicJsonToOffFormLogic';
import { FsFormModel } from '../classes/subtrees';
import { TOffFormLogicEntity } from '../../chrome-extension/AppState/types';
import formJson5375703 from '../../test-dev-resources/form-json/5375703.json';
import confirmationJson5375703 from '../../test-dev-resources/confirmation-json/5375703.json';
import { TApiFormJson, transformers } from '..';

describe('transformLogicJsonToOffFormLogic', () => {
  it('should transform logic JSON to OffFormLogicEntity for notificationEmail', () => {
    const offFormLogicJson = {
      id: '1',
      name: 'Notification Email',
      logic: {
        /* logic object */
      },
    };
    const entityType = 'notificationEmail';
    const formModel = new FsFormModel();

    const result = transformLogicJsonToOffFormLogic(
      offFormLogicJson,
      entityType,
      formModel
    );

    // Assert the result based on your expectations
    expect(result).toStrictEqual({
      id: 'NE-1',
      name: '[NE]Notification Email',
      graphMap: [],
      statusMessages: [],
      entityType: 'notificationEmail',
    });
  });
  it('should transform logic JSON to OffFormLogicEntity for webhook', () => {
    const offFormLogicJson = {
      id: '1',
      name: 'Redirect',
      logic: {
        /* logic object */
      },
    };
    const entityType = 'webhook'; //  'redirect';
    const formModel = new FsFormModel();

    const result = transformLogicJsonToOffFormLogic(
      offFormLogicJson,
      entityType,
      formModel
    );

    // Assert the result based on your expectations
    expect(result).toStrictEqual({
      id: 'WH-1',
      name: '[WH]Redirect',
      graphMap: [],
      statusMessages: [],
      entityType: 'webhook',
    });
  });
  it('should transform logic JSON to OffFormLogicEntity for confirmationEmail', () => {
    const offFormLogicJson = {
      id: '1',
      name: 'Confirmation Email',
      logic: {
        /* logic object */
      },
    };
    const entityType = 'confirmationEmail';
    const formModel = new FsFormModel();

    const result = transformLogicJsonToOffFormLogic(
      offFormLogicJson,
      entityType,
      formModel
    );

    // Assert the result based on your expectations
    expect(result).toStrictEqual({
      id: 'CE-1',
      name: '[CE]Confirmation Email',
      graphMap: [],
      statusMessages: [],
      entityType: 'confirmationEmail',
    });
  });
  it('should transform logic JSON to OffFormLogicEntity unknown offFormLogic entity (webhook confirmation notification)', () => {
    const offFormLogicJson = {
      id: '1',
      name: 'Confirmation Email',
      logic: {
        /* logic object */
      },
    };
    const entityType = '_UNKNOWN_';
    const formModel = new FsFormModel();

    const result = transformLogicJsonToOffFormLogic(
      offFormLogicJson,
      // @ts-ignore - not correct type, purpose of this test.
      entityType,
      formModel
    );

    // Assert the result based on your expectations
    expect(result).toStrictEqual({
      id: '??-1',
      name: '[??]Confirmation Email',
      graphMap: [],
      statusMessages: [],
      entityType: '_UNKNOWN_',
    });
  });
  it.skip('should transform logic JSON to OffFormLogicEntity with graphMap', () => {
    const offFormLogicJson = {
      id: '1',
      name: 'Confirmation Email',
      logic: {
        /* logic object */
      },
    };
    const entityType = 'confirmationEmail';
    const formModel = new FsFormModel();

    const result = transformLogicJsonToOffFormLogic(
      offFormLogicJson,
      entityType,
      formModel
    );

    // Assert the result based on your expectations
    expect(result).toStrictEqual({
      id: 'CE-1',
      name: '[CE]Confirmation Email',
      graphMap: [],
      statusMessages: [],
      entityType: 'confirmationEmail',
    });
  });
  it.skip('should transform logic JSON to OffFormLogicEntity with statusMessages', () => {
    const offFormLogicJson = {
      id: '1',
      name: 'Confirmation Email',
      logic: {
        /* logic object */
      },
    };
    const entityType = 'confirmationEmail';
    const formModel = new FsFormModel();

    const result = transformLogicJsonToOffFormLogic(
      offFormLogicJson,
      entityType,
      formModel
    );

    // Assert the result based on your expectations
    expect(result).toStrictEqual({
      id: 'CE-1',
      name: '[CE]Confirmation Email',
      graphMap: [],
      statusMessages: [],
      entityType: 'confirmationEmail',
    });
  });

  it('should transform logic JSON to OffFormLogicEntity with statusMessages', () => {
    const offFormLogicJson = {
      id: '1',
      name: 'Confirmation Email',
      logic: {
        /* logic object */
      },
    };
    const entityType = 'confirmationEmail';
    const formModelx = FsFormModel.fromApiFormJson(
      transformers.formJson(formJson5375703 as unknown as TApiFormJson)
    );
    const agTree = formModelx.aggregateOffFormLogicJson(
      // @ts-ignore
      confirmationJson5375703.confirmations[0].logic
    );
    const formModel = new FsFormModel();
    formModel.aggregateOffFormLogicJson = jest.fn().mockReturnValueOnce(agTree);
    const result = transformLogicJsonToOffFormLogic(
      offFormLogicJson,
      entityType,
      formModel
    );

    // Assert the result based on your expectations
    expect(Object.keys(result)).toEqual([
      'id',
      'name',
      'graphMap',
      'statusMessages',
      'entityType',
    ]);

    // expect(result).toStrictEqual({
    //     id: 'CE-1',
    //     name: '[CE]Confirmation Email',
    //     graphMap: [],
    //     statusMessages: [],
    //     entityType: 'confirmationEmail',
    //   });
  });
});
