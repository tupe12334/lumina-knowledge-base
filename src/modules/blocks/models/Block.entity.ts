import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Module as ModuleEntity } from '../../modules/models/Module.entity';
import { BlockRelationship } from './BlockRelationship.entity';

@ObjectType()
export class Block {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field(() => [BlockRelationship], { nullable: true })
  @ApiProperty({ type: () => [BlockRelationship], required: false })
  prerequisiteFor?: BlockRelationship[];

  @Field(() => [BlockRelationship], { nullable: true })
  @ApiProperty({ type: () => [BlockRelationship], required: false })
  postrequisiteOf?: BlockRelationship[];

  @Field(() => [ModuleEntity], { nullable: true })
  @ApiProperty({ type: () => [ModuleEntity], required: false })
  modules?: ModuleEntity[];
}
