import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Block } from './Block.entity';
import { RelationshipMetadata } from './RelationshipMetadata.entity';

@ObjectType()
export class BlockRelationship {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty()
  @Field()
  prerequisiteId!: string;

  @ApiProperty()
  @Field()
  postrequisiteId!: string;

  @ApiProperty({ type: () => Block, nullable: true })
  @Field(() => Block, { nullable: true })
  prerequisite?: Block;

  @ApiProperty({ type: () => Block, nullable: true })
  @Field(() => Block, { nullable: true })
  postrequisite?: Block;

  @ApiProperty({ type: () => [RelationshipMetadata], nullable: true })
  @Field(() => [RelationshipMetadata], { nullable: true })
  metadata?: RelationshipMetadata[];
}
