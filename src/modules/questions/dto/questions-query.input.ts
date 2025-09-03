import {
  IsOptional,
  IsString,
  IsUUID,
  IsIn,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { QuestionType } from '../models/question-type.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QuestionsQueryInput {
  @ApiPropertyOptional({
    type: [String],
    description: 'Filter questions by module IDs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  moduleIds?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter questions by course IDs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  courseIds?: string[];

  @ApiPropertyOptional({
    enum: QuestionType,
    isArray: true,
    description: 'Filter questions by question types',
  })
  @IsOptional()
  @IsArray()
  @IsIn(['selection', 'value', 'boolean', 'void'], { each: true })
  questionTypes?: QuestionType[];

  @ApiPropertyOptional({
    description:
      'Whether to include questions from submodules when filtering by module (default: true)',
  })
  @IsOptional()
  @IsBoolean()
  includeSubmodules?: boolean;

  // Keep the old single-value fields for backward compatibility
  @ApiPropertyOptional({
    description: 'Filter questions by module ID (deprecated, use moduleIds)',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  moduleId?: string;

  @ApiPropertyOptional({
    description: 'Filter questions by course ID (deprecated, use courseIds)',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional({
    enum: QuestionType,
    description:
      'Filter questions by question type (deprecated, use questionTypes)',
  })
  @IsOptional()
  @IsIn(['selection', 'value', 'boolean', 'void'])
  questionType?: QuestionType;
}
