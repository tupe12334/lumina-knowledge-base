import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { University } from '../../universities/models/University.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { Module } from '../../modules/models/Module.entity';
import { Block } from 'src/modules/blocks/models/Block.entity';

@ObjectType()
export class Course {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty({ type: () => Translation })
  @Field(() => Translation)
  @Type(() => Translation)
  name!: Translation;

  @ApiProperty()
  @Field()
  universityId!: string;

  @ApiProperty({ type: () => University, nullable: true })
  @Field(() => University, { nullable: true })
  university?: University;

  @ApiProperty({ type: () => [Module], nullable: true })
  @Field(() => [Module], { nullable: true })
  modules?: Module[];

  @ApiProperty({ type: () => Date, nullable: true })
  @Field(() => Date, { nullable: true })
  publishedAt!: Date | null;

  @ApiProperty({ type: () => Block, nullable: true })
  @Field(() => Block, { nullable: true })
  Block?: Block;
}
