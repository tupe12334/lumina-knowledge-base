import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  QuestionType,
  QuestionValidationStatus,
  Question as PrismaQuestion,
} from '@prisma/client';
import { Translation } from '../../translations/models/Translation.entity';
import { Module } from '../../modules/models/Module.entity';
import { Answer } from './Answer.entity';
import { QuestionPart } from './QuestionPart.entity';

registerEnumType(QuestionType, {
  name: 'QuestionType',
  description: 'The type of the question',
});

registerEnumType(QuestionValidationStatus, {
  name: 'QuestionValidationStatus',
  description: 'The validation status of the question',
});

@ObjectType()
export class Question implements PrismaQuestion {
  @ApiProperty()
  @Field(() => String)
  id: string;

  @ApiProperty({
    enum: QuestionValidationStatus,
    enumName: 'QuestionValidationStatus',
  })
  @Field(() => QuestionValidationStatus)
  validationStatus: QuestionValidationStatus;

  @ApiProperty()
  @Field(() => String)
  translationId: string;

  @ApiProperty({ type: () => Translation })
  @Field(() => Translation)
  text: Translation;

  @ApiProperty({ type: () => [Answer], nullable: true })
  @Field(() => [Answer], { nullable: true })
  Answer: Answer[];

  @ApiProperty({ enum: QuestionType, enumName: 'QuestionType' })
  @Field(() => QuestionType)
  type: QuestionType;

  @ApiProperty({ type: () => [Module], nullable: true })
  @Field(() => [Module], { nullable: true })
  Modules: Module[];

  @ApiProperty({ type: () => [QuestionPart], nullable: true })
  @Field(() => [QuestionPart], { nullable: true })
  Parts: QuestionPart[];

  @ApiProperty({ type: () => [QuestionPart], nullable: true })
  @Field(() => [QuestionPart], { nullable: true })
  PartOf: QuestionPart[];
}
