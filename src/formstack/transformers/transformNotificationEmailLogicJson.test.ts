import { transformNotificationEmailLogicJson } from './transformNotificationEmailLogicJson';
import {
  TFsFieldLogicCheckLeaf,
  TFsFieldLogicCheckLeafJson,
  TFsFieldLogicJunction,
  TFsFieldLogicJunctionJson,
  TFsJunctionOperators,
} from '../classes/subtrees/types';

describe('transformNotificationEmailLogicJson', () => {
  it('should return an empty array if no checks are provided', () => {
    const logic: TFsFieldLogicJunctionJson = {
      checks: [],
      conditional: 'all',
      //   operator: 'and',
    };
    const result = transformNotificationEmailLogicJson(logic);
    expect(result.checks).toEqual([]);
  });
  it('should return an empty array if checks are not provided', () => {
    const logic: TFsFieldLogicJunctionJson = {
      conditional: 'all',
      //   operator: 'and',
    };
    const result = transformNotificationEmailLogicJson(logic);
    expect(result.checks).toEqual([]);
  });
  it('should return an empty array if checks are not an array', () => {
    const logic: TFsFieldLogicJunctionJson = {
      // @ts-ignore - bad data type, the subject of the test
      checks: {},
      conditional: 'all',
      //   operator: 'and',
    };
    const result = transformNotificationEmailLogicJson(logic);
    expect(result.checks).toEqual([]);
  });
  it('should return an array of checks if checks are provided', () => {
    const logic: TFsFieldLogicJunctionJson = {
      checks: [
        //@ts-ignore - bad data type, the subject of the test
        {
          field: '123',
          fieldId: '123',
          condition: 'equals',
          option: 'test',
          //   operator: '',
        } as unknown as TFsFieldLogicCheckLeafJson,
      ],
      conditional: 'all',
      //   operator: 'and',
    };
    const result = transformNotificationEmailLogicJson(logic);
    expect(result.checks).toEqual([
      {
        field: '123',
        fieldId: '123',
        condition: 'equals',
        option: 'test',
      },
    ]);
  });
  it('should return an array of checks if checks are null.', () => {
    const logic: TFsFieldLogicJunctionJson = {
      checks: null,
      conditional: 'all',
    };
    const result = transformNotificationEmailLogicJson(logic);
    expect(result).toEqual({ checks: [], conditional: 'all' });
  });
  it('should return an array of checks if checks are undefined.', () => {
    const logic: TFsFieldLogicJunctionJson = {
      //   checks: null,
      conditional: 'all',
    };
    const result = transformNotificationEmailLogicJson(logic);
    expect(result).toEqual({ checks: [], conditional: 'all' });
  });
  it('should return an array of checks if checks are not an array.', () => {
    const logic: TFsFieldLogicJunctionJson = {
      // @ts-ignore - bad data type, the subject of the test
      checks: {},
      conditional: 'all',
    };
    const result = transformNotificationEmailLogicJson(logic);
    expect(result).toEqual({ checks: [], conditional: 'all' });
  });
});
