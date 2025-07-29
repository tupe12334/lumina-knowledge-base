import { IsOptional, IsString, IsUUID, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

const QUESTION_TYPES = ['selection', 'value', 'void'] as const;
type QuestionType = (typeof QUESTION_TYPES)[number];

export class QuestionsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter questions by module ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  moduleId?: string;

  @ApiPropertyOptional({
    description: 'Filter questions by course ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional({
    description: 'Filter questions by question type',
    example: 'selection',
    enum: QUESTION_TYPES,
  })
  @IsOptional()
  @IsIn(QUESTION_TYPES)
  questionType?: QuestionType;

  @ApiPropertyOptional({
    description: 'Exclude questions that are part of other questions',
    example: true,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (typeof value === 'boolean') return value;
    return undefined;
  })
  excludePartQuestions?: boolean;
}
