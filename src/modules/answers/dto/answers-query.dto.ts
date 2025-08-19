import { IsOptional, IsUUID } from 'class-validator';

export class AnswersQueryDto {
  @IsOptional()
  @IsUUID()
  questionId?: string;
}
