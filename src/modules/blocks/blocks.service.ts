import { Injectable } from '@nestjs/common';
import { Block } from './models/Block.entity';
import { CreateBlockRelationshipInput } from './dto/create-block-relationship.input';
import { DeleteBlockRelationshipInput } from './dto/delete-block-relationship.input';
import { BlockRelationshipResult } from './dto/block-relationship-result.type';
import { CreateBlockInput } from './dto/create-block.input';
import { CreateManyBlocksInput } from './dto/create-many-blocks.input';
import { UpdateBlockInput } from './dto/update-block.input';
import { BlocksQueryService } from './services/blocks-query.service';
import { BlocksRelationshipService } from './services/blocks-relationship.service';

@Injectable()
export class BlocksService {
  constructor(
    private readonly queryService: BlocksQueryService,
    private readonly relationshipService: BlocksRelationshipService,
  ) {}

  async create(createBlockInput: CreateBlockInput): Promise<Block> {
    return this.queryService.create(createBlockInput);
  }

  async createMany(input: CreateManyBlocksInput) {
    return this.queryService.createMany(input);
  }

  async findAll(): Promise<Block[]> {
    return this.queryService.findAll();
  }

  async findUnique(id: string): Promise<Block | null> {
    return this.queryService.findUnique(id);
  }

  async update(id: string, updateBlockInput: UpdateBlockInput): Promise<Block> {
    return this.queryService.update(id, updateBlockInput);
  }

  async delete(id: string): Promise<Block> {
    return this.queryService.delete(id);
  }

  async createBlockRelationship(
    relationshipData: CreateBlockRelationshipInput,
  ): Promise<BlockRelationshipResult> {
    return this.relationshipService.createBlockRelationship(relationshipData);
  }

  async deleteBlockRelationship(
    relationshipData: DeleteBlockRelationshipInput,
  ): Promise<BlockRelationshipResult> {
    return this.relationshipService.deleteBlockRelationship(relationshipData);
  }
}