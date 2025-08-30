import { ApiProperty } from '@nestjs/swagger';
import { Answer as PrismaAnswer } from '@prisma/client';
import { Translation } from '../../translations/models/Translation.entity';

export class Answer implements PrismaAnswer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  questionId: string;

  @ApiProperty({ type: () => [SelectAnswer], required: false })
  SelectAnswer?: SelectAnswer[];

  @ApiProperty({ type: () => UnitAnswer, required: false })
  UnitAnswer?: OptionalUnitAnswer;

  @ApiProperty({ type: () => NumberAnswer, required: false })
  NumberAnswer?: OptionalNumberAnswer;
}

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

export class UnitAnswer {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  value!: number;

  @ApiProperty()
  unit!: string;

  @ApiProperty()
  answerId!: string;
}

export class NumberAnswer {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  value!: number;

  @ApiProperty()
  answerId!: string;
}

type OptionalUnitAnswer = UnitAnswer | null;
type OptionalNumberAnswer = NumberAnswer | null;

