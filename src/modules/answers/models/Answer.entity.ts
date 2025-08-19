import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Answer as PrismaAnswer } from '@prisma/client';
import { Translation } from '../../translations/models/Translation.entity';

@ObjectType()
export class Answer implements PrismaAnswer {
  @ApiProperty()
  @Field(() => String)
  id: string;

  @ApiProperty()
  @Field(() => String)
  questionId: string;

  @ApiProperty({ type: () => [SelectAnswer], nullable: true })
  @Field(() => [SelectAnswer], { nullable: true })
  SelectAnswer?: SelectAnswer[];

  @ApiProperty({ type: () => UnitAnswer, nullable: true })
  @Field(() => UnitAnswer, { nullable: true })
  UnitAnswer?: UnitAnswer | null;

  @ApiProperty({ type: () => NumberAnswer, nullable: true })
  @Field(() => NumberAnswer, { nullable: true })
  NumberAnswer?: NumberAnswer | null;
}

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
