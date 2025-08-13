import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Block } from '../models/Block.entity';

/**
 * GraphQL object type representing a block relationship operation result.
 * Used to return information about successful relationship operations.
 */
@ObjectType()
export class BlockRelationshipResult {
  /**
   * The ID of the created/deleted relationship.
   */
  @Field(() => ID, {
    description: 'ID of the created/deleted relationship',
  })
  @ApiProperty({
    description: 'ID of the created/deleted relationship',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  id: string;

  /**
   * The prerequisite block.
   */
  @Field(() => Block, {
    description: 'The prerequisite block',
  })
  @ApiProperty({
    description: 'The prerequisite block',
  })
  prerequisite: Block;

  /**
   * The postrequisite block.
   */
  @Field(() => Block, {
    description: 'The postrequisite block',
  })
  @ApiProperty({
    description: 'The postrequisite block',
  })
  postrequisite: Block;

  /**
   * Metadata associated with the relationship.
   */
  @Field(() => String, {
    description: 'Metadata associated with the relationship (JSON string)',
  })
  @ApiProperty({
    description: 'Metadata associated with the relationship',
    type: 'object',
    example: {
      reason: 'Foundation concepts required',
      type: 'hard',
      description: 'Students must complete this before proceeding',
    },
  })
  metadata: string;
}
