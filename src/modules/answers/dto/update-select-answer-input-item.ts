import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSelectAnswerInputItem {
  @ApiPropertyOptional({ description: 'ID of the select answer item' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Whether the answer item is correct' })
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @ApiPropertyOptional({ description: 'Translation ID for answer text' })
  @IsOptional()
  @IsUUID()
  translationId?: string;
}