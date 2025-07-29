import { ApiProperty } from '@nestjs/swagger';
import { Translation } from '../../translations/models/Translation.entity';
import { Module } from '../../modules/models/Module.entity';
import { Answer } from './Answer.entity';

export class Question {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => Translation })
  text!: Translation;

  @ApiProperty({ type: () => [Module], required: false })
  modules?: Module[];

  @ApiProperty({ type: () => [Answer], required: false })
  answers?: Answer[];

  @ApiProperty({ type: () => [QuestionPart], required: false })
  parts?: QuestionPart[];
}

export class QuestionPart {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty({ type: () => Question })
  partQuestion!: Question;
}
