import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Module as ModuleEntity } from '../../modules/models/Module.entity';
import { BlockRelationship } from './BlockRelationship.entity';

@ObjectType()
export class Block {
  @Field(() => ID)
  id!: string;

  @Field(() => [BlockRelationship], { nullable: true })
  prerequisiteFor?: BlockRelationship[];

  @Field(() => [BlockRelationship], { nullable: true })
  postrequisiteOf?: BlockRelationship[];

  @Field(() => [ModuleEntity], { nullable: true })
  modules?: ModuleEntity[];
}
