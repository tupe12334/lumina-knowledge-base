import { InstitutionsCrudApiDecorators } from './institutions-crud-api.decorators';
import { InstitutionsExtendedApiDecorators } from './institutions-extended-api.decorators';

export const InstitutionsApiDecorators = {
  ...InstitutionsCrudApiDecorators,
  ...InstitutionsExtendedApiDecorators,
};