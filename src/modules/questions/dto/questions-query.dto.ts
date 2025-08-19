import { IsOptional, IsString, IsUUID, IsBoolean, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { QuestionType } from '../models/question-type.enum';

export class QuestionsQueryDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  moduleId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsIn(Object.values(QuestionType))
  questionType?: QuestionType;

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
