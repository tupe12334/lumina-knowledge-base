import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { University } from '../../universities/models/University.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { Module } from '../../modules/models/Module.entity';
import { Block } from 'src/modules/blocks/models/Block.entity';

@ObjectType()
export class Course {
  @Field(() => ID)
  id!: string;

  @Field(() => Translation)
  @Type(() => Translation)
  name!: Translation;

  @Field()
  universityId!: string;

  @Field(() => University, { nullable: true })
  university?: University;

  @Field(() => [Module], { nullable: true })
  modules?: Module[];

  @Field(() => Date, { nullable: true })
  publishedAt!: Date | null;

  @Field(() => Block, { nullable: true })
  Block?: Block;
}
