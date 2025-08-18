import { ObjectType, Field, ID } from '@nestjs/graphql';
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
  id: string;

  /**
   * The prerequisite block.
   */
  @Field(() => Block, {
    description: 'The prerequisite block',
  })
  prerequisite: Block;

  /**
   * The postrequisite block.
   */
  @Field(() => Block, {
    description: 'The postrequisite block',
  })
  postrequisite: Block;

  /**
   * Metadata associated with the relationship.
   */
  @Field(() => String, {
    description: 'Metadata associated with the relationship (JSON string)',
  })
  metadata: string;
}
