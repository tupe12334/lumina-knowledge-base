import { ModulesCrudApiDecorators } from './modules-crud-api.decorators';
import { ModulesExtendedApiDecorators } from './modules-extended-api.decorators';

export const ModulesApiDecorators = {
  ...ModulesCrudApiDecorators,
  ...ModulesExtendedApiDecorators,
};