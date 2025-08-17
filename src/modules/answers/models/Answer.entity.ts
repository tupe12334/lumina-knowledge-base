import { Field, ObjectType } from '@nestjs/graphql';
import { Answer as PrismaAnswer } from '../../../../generated/client';

@ObjectType()
export class Answer implements PrismaAnswer {
  @Field(() => String)
  id: string;

  @Field(() => String)
  questionId: string;

  // TODO: Add relations for SelectAnswer, UnitAnswer, NumberAnswer
}
