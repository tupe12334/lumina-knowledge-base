import { Field, ObjectType } from '@nestjs/graphql';
import { QuestionPart as PrismaQuestionPart } from '@prisma/client';

@ObjectType()
export class QuestionPart implements PrismaQuestionPart {
  @Field(() => String)
  id: string;

  @Field(() => String)
  questionId: string;

  @Field(() => String)
  partQuestionId: string;

  @Field(() => Number)
  order: number;
}
