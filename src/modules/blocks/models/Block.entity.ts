import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Module as ModuleEntity } from '../../modules/models/Module.entity';
import { BlockRelationship } from './BlockRelationship.entity';

@ObjectType()
export class Block {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty({ type: () => [BlockRelationship], nullable: true })
  @Field(() => [BlockRelationship], { nullable: true })
  prerequisiteFor?: BlockRelationship[];

  @ApiProperty({ type: () => [BlockRelationship], nullable: true })
  @Field(() => [BlockRelationship], { nullable: true })
  postrequisiteOf?: BlockRelationship[];

  @ApiProperty({ type: () => [ModuleEntity], nullable: true })
  @Field(() => [ModuleEntity], { nullable: true })
  modules?: ModuleEntity[];
}
