import { Injectable } from '@nestjs/common';
import { CreateBlockRelationshipInput } from '../dto/create-block-relationship.input';
import { DeleteBlockRelationshipInput } from '../dto/delete-block-relationship.input';
import { BlockRelationshipResult } from '../dto/block-relationship-result.type';
import { BlocksRelationshipValidatorService } from './blocks-relationship-validator.service';
import { BlocksRelationshipQueryService } from './blocks-relationship-query.service';
import { BlocksRelationshipFormatterService } from './blocks-relationship-formatter.service';

@Injectable()
export class BlocksRelationshipService {
  constructor(
    private readonly validator: BlocksRelationshipValidatorService,
    private readonly query: BlocksRelationshipQueryService,
    private readonly formatter: BlocksRelationshipFormatterService,
  ) {}

  async createBlockRelationship(
    relationshipData: CreateBlockRelationshipInput,
  ): Promise<BlockRelationshipResult> {
    const { prerequisiteBlockId, postrequisiteBlockId } = relationshipData;

    this.validator.validateSelfRelationship(prerequisiteBlockId, postrequisiteBlockId);
    await this.validator.validateBlocksExist(prerequisiteBlockId, postrequisiteBlockId);
    await this.validator.checkExistingRelationship(prerequisiteBlockId, postrequisiteBlockId);

    const relationship = await this.query.createRelationship(relationshipData);
    return this.formatter.formatRelationshipResult(relationship);
  }

  async deleteBlockRelationship(
    relationshipData: DeleteBlockRelationshipInput,
  ): Promise<BlockRelationshipResult> {
    const { prerequisiteBlockId, postrequisiteBlockId } = relationshipData;

    await this.validator.validateBlocksExist(prerequisiteBlockId, postrequisiteBlockId);
    const relationship = await this.query.findRelationship(prerequisiteBlockId, postrequisiteBlockId);
    await this.query.deleteRelationship(prerequisiteBlockId, postrequisiteBlockId);

    return this.formatter.formatRelationshipResult(relationship);
  }
}