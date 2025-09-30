import { QuestionsCrudApiDecorators } from './questions-crud-api.decorators';
import { QuestionsOperationsApiDecorators } from './questions-operations-api.decorators';

export const QuestionsApiDecorators = {
  ...QuestionsCrudApiDecorators,
  ...QuestionsOperationsApiDecorators,
};