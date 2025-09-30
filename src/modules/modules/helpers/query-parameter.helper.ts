import { BooleanOrString } from '../types/query-parameter.types';

export class QueryParameterHelper {
  /**
   * Converts string 'true'/'false' to boolean, keeps boolean as-is
   */
  static parseBoolean(value: BooleanOrString | undefined): boolean | undefined {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value;
    return value === 'true';
  }
}