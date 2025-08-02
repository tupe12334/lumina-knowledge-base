import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Translation } from '../../translations/models/Translation.entity';
import { Module } from '../../modules/models/Module.entity';
import { Answer } from './Answer.entity';

@ObjectType()
export class Question {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field(() => Translation)
  @ApiProperty({ type: () => Translation })
  text!: Translation;

  @Field(() => [Module], { nullable: true })
  @ApiProperty({ type: () => [Module], required: false })
  modules?: Module[];

  @Field(() => [Answer], { nullable: true })
  @ApiProperty({ type: () => [Answer], required: false })
  answers?: Answer[];

  @Field(() => [QuestionPart], { nullable: true })
  @ApiProperty({ type: () => [QuestionPart], required: false })
  parts?: QuestionPart[];
}

@ObjectType()
export class QuestionPart {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field(() => Int)
  @ApiProperty()
  order!: number;

  @Field(() => Question)
  @ApiProperty({ type: () => Question })
  partQuestion!: Question;
}
