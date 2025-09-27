import { CoursesCreationApiDecorators } from './courses-creation-api.decorators';
import { CoursesOperationsApiDecorators } from './courses-operations-api.decorators';
import { CoursesExtendedApiDecorators } from './courses-extended-api.decorators';

export const CoursesApiDecorators = {
  ...CoursesCreationApiDecorators,
  ...CoursesOperationsApiDecorators,
  ...CoursesExtendedApiDecorators,
};