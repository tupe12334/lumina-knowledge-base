import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { BlocksService } from './blocks.service';
import { Block } from './models/Block.entity';

/**
 * GraphQL resolver for block-related operations.
 * Provides GraphQL queries for retrieving block information.
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
}
