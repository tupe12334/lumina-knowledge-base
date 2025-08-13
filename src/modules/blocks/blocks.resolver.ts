import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { BlocksService } from './blocks.service';
import { Block } from './models/Block.entity';
import { CreateBlockRelationshipInput } from './dto/create-block-relationship.input';
import { DeleteBlockRelationshipInput } from './dto/delete-block-relationship.input';
import { BlockRelationshipResult } from './dto/block-relationship-result.type';

/**
 * GraphQL resolver for block-related operations.
 * Provides GraphQL queries and mutations for retrieving and managing block information.
 */
@Resolver(() => Block)
export class BlocksResolver {
  constructor(private readonly blocksService: BlocksService) {}

  /**
   * Retrieves a specific block by its ID.
   * @param id - The unique identifier of the block
   * @returns Promise<Block | null> The block if found, null otherwise
   */
  @Query(() => Block, {
    name: 'block',
    nullable: true,
    description: 'Get a specific block by ID',
  })
  async getBlock(
    @Args('id', { type: () => ID, description: 'Block ID' }) id: string,
  ): Promise<Block | null> {
    return this.blocksService.findUnique(id);
  }

  /**
   * Creates a prerequisite/postrequisite relationship between two blocks.
   * @param input - The relationship creation data
   * @returns Promise<BlockRelationshipResult> The result of the operation
   */
  @Mutation(() => BlockRelationshipResult, {
    name: 'createBlockRelationship',
    description:
      'Create a prerequisite/postrequisite relationship between blocks',
  })
  async createBlockRelationship(
    @Args('input') input: CreateBlockRelationshipInput,
  ): Promise<BlockRelationshipResult> {
    return this.blocksService.createBlockRelationship(input);
  }

  /**
   * Deletes a prerequisite/postrequisite relationship between two blocks.
   * @param input - The relationship deletion data
   * @returns Promise<BlockRelationshipResult> The result of the operation
   */
  @Mutation(() => BlockRelationshipResult, {
    name: 'deleteBlockRelationship',
    description:
      'Delete a prerequisite/postrequisite relationship between blocks',
  })
  async deleteBlockRelationship(
    @Args('input') input: DeleteBlockRelationshipInput,
  ): Promise<BlockRelationshipResult> {
    return this.blocksService.deleteBlockRelationship(input);
  }
}
