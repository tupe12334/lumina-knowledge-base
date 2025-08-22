import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateNested, IsString, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '@prisma/client';

export class CreateCompleteSelectAnswerInput {
  @ApiProperty({
    description: 'English text for the answer option',
    example: 'The derivative of a function',
  })
  @IsString()
  @IsNotEmpty()
  en_text: string;

  @ApiProperty({
    description: 'Hebrew text for the answer option',
    example: 'הנגזרת של פונקציה',
  })
  @IsString()
  @IsNotEmpty()
  he_text: string;

  @ApiProperty({
    description: 'Whether this answer option is correct',
    example: true,
  })
  @IsBoolean()
  is_correct: boolean;
}

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
    enum: ['ai_generated', 'in_manual_review', 'approved', 'rejected'],
    example: 'ai_generated',
    default: 'ai_generated',
  })
  @IsOptional()
  @IsEnum(['ai_generated', 'in_manual_review', 'approved', 'rejected'])
  validationStatus?: 'ai_generated' | 'in_manual_review' | 'approved' | 'rejected';

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
    description: 'Boolean answer for boolean type questions (true = 1, false = 0)',
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
    enum: ['meter', 'kilogram', 'second', 'ampere', 'kelvin', 'mole', 'candela'],
    example: 'meter',
  })
  @IsOptional()
  @IsEnum(['meter', 'kilogram', 'second', 'ampere', 'kelvin', 'mole', 'candela'])
  unit?: 'meter' | 'kilogram' | 'second' | 'ampere' | 'kelvin' | 'mole' | 'candela';
}

export class CreateCompleteQuestionsInput {
  @ApiProperty({
    description: 'Array of complete questions to create',
    type: [CreateCompleteQuestionInput],
    example: [
      {
        en_text: 'What is calculus?',
        he_text: 'מה זה חשבון אינפיניטסימלי?',
        type: 'selection',
        moduleIds: ['uuid-1'],
        selectAnswers: [
          {
            en_text: 'A branch of mathematics',
            he_text: 'ענף במתמטיקה',
            is_correct: true,
          },
          {
            en_text: 'A type of calculator',
            he_text: 'סוג של מחשבון',
            is_correct: false,
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompleteQuestionInput)
  questions: CreateCompleteQuestionInput[];
}