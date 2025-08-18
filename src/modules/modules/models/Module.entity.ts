import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Translation } from '../../translations/models/Translation.entity';
import { Block } from 'src/modules/blocks/models/Block.entity';
import { Question } from '../../questions/models/Question.entity';

@ObjectType()
export class Module {
  @Field(() => ID)
  id!: string;

  @Field(() => Translation)
  @Type(() => Translation)
  name!: Translation;

  translationId!: string;

  @Field(() => [Module], { nullable: true })
  subModules?: Module[];

  @Field(() => [Module], { nullable: true })
  parentModules?: Module[];

  @Field(() => Block, { nullable: true })
  Block?: Block;

  @Field(() => [Question], { nullable: true })
  questions?: Question[];
}
