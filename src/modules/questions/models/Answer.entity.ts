import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Translation } from '../../translations/models/Translation.entity';

@ObjectType()
export class SelectAnswer {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field()
  @ApiProperty()
  isCorrect!: boolean;

  @Field()
  @ApiProperty()
  translationId!: string;

  @Field(() => Translation)
  @ApiProperty({ type: () => Translation })
  text!: Translation;

  @Field()
  @ApiProperty()
  answerId!: string;
}

@ObjectType()
export class UnitAnswer {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field(() => Float)
  @ApiProperty()
  value!: number;

  @Field()
  @ApiProperty()
  unit!: string;

  @Field()
  @ApiProperty()
  answerId!: string;
}

@ObjectType()
export class NumberAnswer {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field(() => Float)
  @ApiProperty()
  value!: number;

  @Field()
  @ApiProperty()
  answerId!: string;
}

@ObjectType()
export class Answer {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field()
  @ApiProperty()
  questionId!: string;

  @Field(() => [SelectAnswer], { nullable: true })
  @ApiProperty({ type: () => [SelectAnswer], required: false })
  SelectAnswer?: SelectAnswer[];

  @Field(() => UnitAnswer, { nullable: true })
  @ApiProperty({ type: () => UnitAnswer, required: false })
  UnitAnswer?: UnitAnswer | null;

  @Field(() => NumberAnswer, { nullable: true })
  @ApiProperty({ type: () => NumberAnswer, required: false })
  NumberAnswer?: NumberAnswer | null;
}
