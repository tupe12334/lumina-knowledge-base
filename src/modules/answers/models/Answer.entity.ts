import { ApiProperty } from '@nestjs/swagger';
import { Answer as PrismaAnswer } from '@prisma/client';
import { SelectAnswer } from './SelectAnswer.entity';
import { UnitAnswer } from './UnitAnswer.entity';
import { NumberAnswer } from './NumberAnswer.entity';

type OptionalUnitAnswer = UnitAnswer | null;
type OptionalNumberAnswer = NumberAnswer | null;

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

