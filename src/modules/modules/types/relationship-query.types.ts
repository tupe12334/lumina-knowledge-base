import { BooleanOrString } from './base-query.types';

export interface HasPrerequisitesQuery {
  hasPrerequisites?: BooleanOrString;
}

export interface HasPostrequisitesQuery {
  hasPostrequisites?: BooleanOrString;
}