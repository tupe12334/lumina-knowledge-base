import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { University } from '../../universities/models/University.entity';
import { Discipline } from '../../disciplines/models/Discipline.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { Module } from '../../modules/models/Module.entity';
import { Block } from 'src/modules/blocks/models/Block.entity';

@ObjectType()
export class Course {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field(() => Translation)
  @Type(() => Translation)
  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @Field()
  @ApiProperty()
  universityId!: string;

  @Field()
  @ApiProperty()
  disciplineId!: string;

  @Field(() => University, { nullable: true })
  @ApiProperty({ type: () => University, required: false })
  university?: University;

  @Field(() => Discipline, { nullable: true })
  @ApiProperty({ type: () => Discipline, required: false })
  discipline?: Discipline;

  @Field(() => [Module], { nullable: true })
  @ApiProperty({ type: () => [Module], required: false })
  modules?: Module[];

  @Field(() => Date, { nullable: true })
  @ApiProperty({ nullable: true })
  publishedAt!: Date | null;

  @Field(() => Block, { nullable: true })
  @ApiProperty({ nullable: true })
  Block?: Block;
}
