import { BooleanOrString } from './base-query.types';

export interface HasSubModulesQuery {
  hasSubModules?: BooleanOrString;
}

export interface HasParentModulesQuery {
  hasParentModules?: BooleanOrString;
}