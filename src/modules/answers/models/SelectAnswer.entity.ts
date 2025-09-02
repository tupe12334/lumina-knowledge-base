import { ApiProperty } from '@nestjs/swagger';
import { Translation } from '../../translations/models/Translation.entity';

export class SelectAnswer {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  isCorrect!: boolean;

  @ApiProperty()
  translationId!: string;

  @ApiProperty({ type: () => Translation })
  text!: Translation;

  @ApiProperty()
  answerId!: string;
}