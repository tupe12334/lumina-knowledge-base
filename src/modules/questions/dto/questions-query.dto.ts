import { IsOptional, IsString, IsUUID, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { QuestionType } from '../models/question-type.enum';

export class QuestionsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  moduleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional({ enum: QuestionType, enumName: 'QuestionType' })
  @IsOptional()
  @IsIn(Object.values(QuestionType))
  questionType?: QuestionType;

  @ApiPropertyOptional()
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
