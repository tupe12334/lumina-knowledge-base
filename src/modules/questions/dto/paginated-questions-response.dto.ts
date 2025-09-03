import { Question } from '../models/Question.entity';
export class PaginatedQuestionsResponse {
  questions: Question[];

  totalCount: number;

  offset: number;

  limit: number;

  hasMore: boolean;
}
