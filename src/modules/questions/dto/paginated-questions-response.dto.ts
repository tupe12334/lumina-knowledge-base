import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Question } from '../models/Question.entity';

@ObjectType()
export class PaginatedQuestionsResponse {
  @Field(() => [Question], { description: 'List of questions' })
  questions: Question[];

  @Field(() => Int, {
    description: 'Total number of questions matching the criteria',
  })
  totalCount: number;

  @Field(() => Int, { description: 'Current offset (starting position)' })
  offset: number;

  @Field(() => Int, {
    description: 'Number of questions returned in this batch',
  })
  limit: number;

  @Field(() => Boolean, {
    description: 'Whether there are more questions available',
  })
  hasMore: boolean;
}
