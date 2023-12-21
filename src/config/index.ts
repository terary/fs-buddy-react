import { TSimpleDictionary } from '../formstack/classes/Evaluator/type';
import config from './config.json';

const Config = {
  get: (key: string): string => (config as TSimpleDictionary<string>)[key],
};

export { Config };
