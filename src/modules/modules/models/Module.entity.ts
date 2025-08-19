import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Translation } from '../../translations/models/Translation.entity';
import { Block } from 'src/modules/blocks/models/Block.entity';
import { Question } from '../../questions/models/Question.entity';

@ObjectType()
export class Module {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty({ type: () => Translation })
  @Field(() => Translation)
  @Type(() => Translation)
  name!: Translation;

  @ApiProperty()
  translationId!: string;

  @ApiProperty({ type: () => [Module], nullable: true })
  @Field(() => [Module], { nullable: true })
  subModules?: Module[];

  @ApiProperty({ type: () => [Module], nullable: true })
  @Field(() => [Module], { nullable: true })
  parentModules?: Module[];

  @ApiProperty({ type: () => Block, nullable: true })
  @Field(() => Block, { nullable: true })
  Block?: Block;

  @ApiProperty({ type: () => [Question], nullable: true })
  @Field(() => [Question], { nullable: true })
  questions?: Question[];
}
