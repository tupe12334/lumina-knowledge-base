import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Translation } from '../../translations/models/Translation.entity';

type OptionalUnitAnswer = UnitAnswer | null;
type OptionalNumberAnswer = NumberAnswer | null;
type OptionalBooleanAnswer = BooleanAnswer | null;

@ObjectType()
export class SelectAnswer {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty()
  @Field()
  isCorrect!: boolean;

  @ApiProperty()
  @Field()
  translationId!: string;

  @ApiProperty({ type: () => Translation })
  @Field(() => Translation)
  text!: Translation;

  @ApiProperty()
  @Field()
  answerId!: string;
}

@ObjectType()
export class UnitAnswer {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty()
  @Field(() => Float)
  value!: number;

  @ApiProperty()
  @Field()
  unit!: string;

  @ApiProperty()
  @Field()
  answerId!: string;
}

@ObjectType()
export class NumberAnswer {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty()
  @Field(() => Float)
  value!: number;

  @ApiProperty()
  @Field()
  answerId!: string;
}

@ObjectType()
export class BooleanAnswer {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty()
  @Field()
  value!: boolean;

  @ApiProperty()
  @Field()
  answerId!: string;
}

@ObjectType()
export class Answer {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty()
  @Field()
  questionId!: string;

  @ApiProperty({ type: () => [SelectAnswer], nullable: true })
  @Field(() => [SelectAnswer], { nullable: true })
  SelectAnswer?: SelectAnswer[];

  @ApiProperty({ type: () => UnitAnswer, nullable: true })
  @Field(() => UnitAnswer, { nullable: true })
  UnitAnswer?: OptionalUnitAnswer;

  @ApiProperty({ type: () => NumberAnswer, nullable: true })
  @Field(() => NumberAnswer, { nullable: true })
  NumberAnswer?: OptionalNumberAnswer;

  @ApiProperty({ type: () => BooleanAnswer, nullable: true })
  @Field(() => BooleanAnswer, { nullable: true })
  BooleanAnswer?: OptionalBooleanAnswer;
}
