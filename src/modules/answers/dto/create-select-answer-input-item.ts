import { IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSelectAnswerInputItem {
  @ApiProperty({ description: 'Whether the answer item is correct' })
  @IsBoolean()
  isCorrect!: boolean;

  @ApiProperty({
    description: 'Translation id for answer text',
    format: 'uuid',
  })
  @IsUUID()
  translationId!: string;
}