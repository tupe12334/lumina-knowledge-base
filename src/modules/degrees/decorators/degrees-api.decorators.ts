import { DegreesCrudApiDecorators } from './degrees-crud-api.decorators';
import { DegreesExtendedApiDecorators } from './degrees-extended-api.decorators';

export const DegreesApiDecorators = {
  ...DegreesCrudApiDecorators,
  ...DegreesExtendedApiDecorators,
};