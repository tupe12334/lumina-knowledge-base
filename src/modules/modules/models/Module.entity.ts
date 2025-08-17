import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Translation } from '../../translations/models/Translation.entity';
import { Block } from 'src/modules/blocks/models/Block.entity';

@ObjectType()
export class Module {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field(() => Translation)
  @Type(() => Translation)
  @ApiProperty({ type: () => Translation })
  name!: Translation;

  translationId!: string;

  @Field(() => [Module], { nullable: true })
  @ApiProperty({ type: () => [Module], required: false })
  subModules?: Module[];

  @Field(() => [Module], { nullable: true })
  @ApiProperty({ type: () => [Module], required: false })
  parentModules?: Module[];

  @Field(() => Block, { nullable: true })
  @ApiProperty({ type: () => Block, required: false })
  Block?: Block;
}
