import { ModuleForDeletion } from './module-for-deletion.type';

export interface CourseWithModules {
  id: string;
  Block: {
    id: string;
    prerequisiteFor: Array<unknown>;
    postrequisiteOf: Array<unknown>;
  };
  translationId: string;
  modules: Array<ModuleForDeletion>;
  name: {
    en_text?: string;
    he_text?: string;
  };
}