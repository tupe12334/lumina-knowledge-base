import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Translation } from '../../translations/models/Translation.entity';

@ObjectType()
export class SelectAnswer {
  @Field(() => ID)
  id!: string;

  @Field()
  isCorrect!: boolean;

  @Field()
  translationId!: string;

  @Field(() => Translation)
  text!: Translation;

  @Field()
  answerId!: string;
}

@ObjectType()
export class UnitAnswer {
  @Field(() => ID)
  id!: string;

  @Field(() => Float)
  value!: number;

  @Field()
  unit!: string;

  @Field()
  answerId!: string;
}

@ObjectType()
export class NumberAnswer {
  @Field(() => ID)
  id!: string;

  @Field(() => Float)
  value!: number;

  @Field()
  answerId!: string;
}

@ObjectType()
export class Answer {
  @Field(() => ID)
  id!: string;

  @Field()
  questionId!: string;

  @Field(() => [SelectAnswer], { nullable: true })
  SelectAnswer?: SelectAnswer[];

  @Field(() => UnitAnswer, { nullable: true })
  UnitAnswer?: UnitAnswer | null;

  @Field(() => NumberAnswer, { nullable: true })
  NumberAnswer?: NumberAnswer | null;
}
