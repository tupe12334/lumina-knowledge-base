import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { QuestionType, QuestionValidationStatus } from '@prisma/client';

export class QuestionsQueryDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ enum: QuestionType, enumName: 'QuestionType' })
  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @ApiPropertyOptional({
    enum: QuestionValidationStatus,
    enumName: 'QuestionValidationStatus',
  })
  @IsEnum(QuestionValidationStatus)
  @IsOptional()
  validationStatus?: QuestionValidationStatus;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  moduleId?: string;

  @ApiPropertyOptional()
  @IsUUID('4', { each: true })
  @IsOptional()
  moduleIds?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  includeSubmodules?: boolean;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  courseId?: string;

  @ApiPropertyOptional()
  @IsUUID('4', { each: true })
  @IsOptional()
  courseIds?: string[];

  @ApiPropertyOptional({ enum: QuestionType, enumName: 'QuestionType' })
  @IsEnum(QuestionType)
  @IsOptional()
  questionType?: QuestionType;

  @ApiPropertyOptional({ enum: QuestionType, enumName: 'QuestionType' })
  @IsEnum(QuestionType, { each: true })
  @IsOptional()
  questionTypes?: QuestionType[];

  // Pagination fields
  @ApiPropertyOptional({ minimum: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  // Additional fields for advanced filtering
  @ApiPropertyOptional()
  @IsUUID('4', { each: true })
  @IsOptional()
  ids?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  textSearch?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  hasParts?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  hasAnswers?: boolean;
}
