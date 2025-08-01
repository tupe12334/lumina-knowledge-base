import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Block } from './Block.entity';
import { RelationshipMetadata } from './RelationshipMetadata.entity';

@ObjectType()
export class BlockRelationship {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field()
  @ApiProperty()
  prerequisiteId!: string;

  @Field()
  @ApiProperty()
  postrequisiteId!: string;

  @Field(() => Block, { nullable: true })
  @ApiProperty({ type: () => Block })
  prerequisite?: Block;

  @Field(() => Block, { nullable: true })
  @ApiProperty({ type: () => Block })
  postrequisite?: Block;

  @Field(() => [RelationshipMetadata], { nullable: true })
  @ApiProperty({ type: () => [RelationshipMetadata] })
  metadata?: RelationshipMetadata[];
}
