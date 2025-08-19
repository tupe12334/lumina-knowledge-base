import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionPart as PrismaQuestionPart } from '@prisma/client';

@ObjectType()
export class QuestionPart implements PrismaQuestionPart {
  @ApiProperty()
  @Field(() => String)
  id: string;

  @ApiProperty()
  @Field(() => String)
  questionId: string;

  @ApiProperty()
  @Field(() => String)
  partQuestionId: string;

  @ApiProperty()
  @Field(() => Number)
  order: number;
}
