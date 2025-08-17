import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  QuestionType,
  QuestionValidationStatus,
  Question as PrismaQuestion,
} from '../../../../generated/client';
import { Translation } from '../../translations/models/Translation.entity';
import { Module } from '../../modules/models/Module.entity';
import { Answer } from '../../answers/models/Answer.entity';
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
  @Field(() => String)
  id: string;

  @Field(() => QuestionValidationStatus)
  validationStatus: QuestionValidationStatus;

  @Field(() => String)
  translationId: string;

  @Field(() => Translation)
  text: Translation;

  @Field(() => [Answer], { nullable: true })
  Answer: Answer[];

  @Field(() => QuestionType)
  type: QuestionType;

  @Field(() => [Module], { nullable: true })
  Modules: Module[];

  @Field(() => [QuestionPart], { nullable: true })
  Parts: QuestionPart[];

  @Field(() => [QuestionPart], { nullable: true })
  PartOf: QuestionPart[];
}
