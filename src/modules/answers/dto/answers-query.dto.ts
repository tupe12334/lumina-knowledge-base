import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AnswersQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  questionId?: string;
}
