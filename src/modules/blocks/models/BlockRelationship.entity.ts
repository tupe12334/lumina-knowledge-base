import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Block } from './Block.entity';
import { RelationshipMetadata } from './RelationshipMetadata.entity';

@ObjectType()
export class BlockRelationship {
  @Field(() => ID)
  id!: string;

  @Field()
  prerequisiteId!: string;

  @Field()
  postrequisiteId!: string;

  @Field(() => Block, { nullable: true })
  prerequisite?: Block;

  @Field(() => Block, { nullable: true })
  postrequisite?: Block;

  @Field(() => [RelationshipMetadata], { nullable: true })
  metadata?: RelationshipMetadata[];
}
