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

export class Question implements PrismaQuestion {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: QuestionValidationStatus,
    enumName: 'QuestionValidationStatus',
  })
  validationStatus: QuestionValidationStatus;

  @ApiProperty()
  translationId: string;

  @ApiProperty({ type: () => Translation })
  text: Translation;

  @ApiProperty({ type: () => [Answer], nullable: true })
  Answer: Answer[];

  @ApiProperty({ enum: QuestionType, enumName: 'QuestionType' })
  type: QuestionType;

  @ApiProperty({ type: () => [Module], nullable: true })
  Modules: Module[];

  @ApiProperty({ type: () => [QuestionPart], nullable: true })
  Parts: QuestionPart[];

  @ApiProperty({ type: () => [QuestionPart], nullable: true })
  PartOf: QuestionPart[];
}
