import { ModulesBasicCrudApiDecorators } from './modules-basic-crud-api.decorators';
import { ModulesQueryCrudApiDecorators } from './modules-query-crud-api.decorators';

export const ModulesCrudApiDecorators = {
  ...ModulesBasicCrudApiDecorators,
  ...ModulesQueryCrudApiDecorators,
};