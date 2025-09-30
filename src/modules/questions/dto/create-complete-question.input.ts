import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '@prisma/client';
import { CreateCompleteSelectAnswerInput } from './create-complete-select-answer.input';
import { ValidationStatusType } from '../types/validation-status.type';
import { VALIDATION_STATUS_VALUES } from '../constants/validation-status.constants';
import { UnitType } from '../types/unit.type';
import { UNIT_VALUES } from '../constants/unit.constants';
export class CreateCompleteQuestionInput {
  @ApiProperty({
    description: 'English text for the question',
    example: 'What is the primary concept in differential calculus?',
  })
  @IsString()
  @IsNotEmpty()
  en_text: string;

  @ApiProperty({
    description: 'Hebrew text for the question',
    example: 'מה המושג העיקרי בחשבון דיפרנציאלי?',
  })
  @IsString()
  @IsNotEmpty()
  he_text: string;

  @ApiProperty({
    description: 'Type of the question',
    enum: QuestionType,
    example: QuestionType.selection,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({
    description: 'Array of module IDs this question belongs to',
    type: [String],
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @IsString({ each: true })
  moduleIds: string[];

  @ApiProperty({
    description: 'Validation status of the question',
    enum: VALIDATION_STATUS_VALUES,
    example: 'ai_generated',
    default: 'ai_generated',
  })
  @IsOptional()
  @IsEnum(VALIDATION_STATUS_VALUES)
  validationStatus?: ValidationStatusType;

  @ApiProperty({
    description: 'Answer options for selection type questions',
    type: [CreateCompleteSelectAnswerInput],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompleteSelectAnswerInput)
  selectAnswers?: CreateCompleteSelectAnswerInput[];

  @ApiProperty({
    description: 'Numeric answer for value type questions',
    required: false,
    example: 42,
  })
  @IsOptional()
  @IsNumber()
  numberAnswer?: number;

  @ApiProperty({
    description:
      'Boolean answer for boolean type questions (true = 1, false = 0)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  booleanAnswer?: number;

  @ApiProperty({
    description: 'Unit value for unit-based answers',
    required: false,
    example: 9.8,
  })
  @IsOptional()
  @IsNumber()
  unitValue?: number;
  @ApiProperty({
    description: 'Unit for unit-based answers',
    required: false,
    enum: UNIT_VALUES,
    example: 'meter',
  })
  @IsOptional()
  @IsEnum(UNIT_VALUES)
  unit?: UnitType;
}