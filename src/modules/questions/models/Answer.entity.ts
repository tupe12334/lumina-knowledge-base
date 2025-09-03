import { ApiProperty } from '@nestjs/swagger';
import { SelectAnswer } from './SelectAnswer.entity';
import { UnitAnswer } from './UnitAnswer.entity';
import { NumberAnswer } from './NumberAnswer.entity';
import { BooleanAnswer } from './BooleanAnswer.entity';

type OptionalUnitAnswer = UnitAnswer | null;
type OptionalNumberAnswer = NumberAnswer | null;
type OptionalBooleanAnswer = BooleanAnswer | null;

export class Answer {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  questionId!: string;

  @ApiProperty({ type: () => [SelectAnswer], nullable: true })
  SelectAnswer?: SelectAnswer[];

  @ApiProperty({ type: () => UnitAnswer, nullable: true })
  UnitAnswer?: OptionalUnitAnswer;

  @ApiProperty({ type: () => NumberAnswer, nullable: true })
  NumberAnswer?: OptionalNumberAnswer;

  @ApiProperty({ type: () => BooleanAnswer, nullable: true })
  BooleanAnswer?: OptionalBooleanAnswer;
}
