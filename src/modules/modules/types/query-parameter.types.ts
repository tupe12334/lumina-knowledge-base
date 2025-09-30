// Type declarations for query parameter conversions
export type BooleanOrString = boolean | string;

export interface FewQuestionsQuery {
  fewQuestions?: BooleanOrString
}

export interface HasQuestionsQuery {
  hasQuestions?: BooleanOrString
}

export interface HasPrerequisitesQuery {
  hasPrerequisites?: BooleanOrString
}

export interface HasPostrequisitesQuery {
  hasPostrequisites?: BooleanOrString
}

export interface HasSubModulesQuery {
  hasSubModules?: BooleanOrString
}

export interface HasParentModulesQuery {
  hasParentModules?: BooleanOrString
}