import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBlockRelationshipInput } from '../dto/create-block-relationship.input';
import { DeleteBlockRelationshipInput } from '../dto/delete-block-relationship.input';
import { BlockRelationshipResult } from '../dto/block-relationship-result.type';
import { createValidMetadataEntries, formatRelationshipMetadata } from '../helpers/relationship-metadata.helper';

type RelationshipWithIncludes = Prisma.BlockRelationshipGetPayload<{
  include: { prerequisite: true; postrequisite: true; metadata: true };
}>;

@Injectable()
export class BlocksRelationshipService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateBlocksExist(prerequisiteBlockId: string, postrequisiteBlockId: string) {
    const [prerequisiteBlock, postrequisiteBlock] = await Promise.all([
      this.prisma.block.findUnique({ where: { id: prerequisiteBlockId } }),
      this.prisma.block.findUnique({ where: { id: postrequisiteBlockId } }),
    ]);

    if (!prerequisiteBlock) {
      throw new NotFoundException(`Prerequisite block with ID ${prerequisiteBlockId} not found`);
    }

    if (!postrequisiteBlock) {
      throw new NotFoundException(`Postrequisite block with ID ${postrequisiteBlockId} not found`);
    }
  }

  private async checkExistingRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string) {
    const existingRelationship = await this.prisma.blockRelationship.findUnique({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
    });

    if (existingRelationship) {
      throw new BadRequestException('Relationship already exists between these blocks');
    }
  }

  async createBlockRelationship(
    relationshipData: CreateBlockRelationshipInput,
  ): Promise<BlockRelationshipResult> {
    const { prerequisiteBlockId, postrequisiteBlockId, metadata } = relationshipData;

    if (prerequisiteBlockId === postrequisiteBlockId) {
      throw new BadRequestException('A block cannot be a prerequisite to itself');
    }

    await this.validateBlocksExist(prerequisiteBlockId, postrequisiteBlockId);
    await this.checkExistingRelationship(prerequisiteBlockId, postrequisiteBlockId);

    const relationship = await this.prisma.blockRelationship.create({
      data: {
        prerequisiteId: prerequisiteBlockId,
        postrequisiteId: postrequisiteBlockId,
        metadata: metadata ? { create: createValidMetadataEntries(metadata) } : undefined,
      },
      include: {
        prerequisite: true,
        postrequisite: true,
        metadata: true,
      },
    });

    const formattedMetadata = formatRelationshipMetadata(relationship.metadata);

    return {
      id: relationship.id,
      prerequisite: relationship.prerequisite,
      postrequisite: relationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }

  async deleteBlockRelationship(
    relationshipData: DeleteBlockRelationshipInput,
  ): Promise<BlockRelationshipResult> {
    const { prerequisiteBlockId, postrequisiteBlockId } = relationshipData;

    await this.validateBlocksExist(prerequisiteBlockId, postrequisiteBlockId);

    const relationship = await this.prisma.blockRelationship.findUnique({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
      include: {
        prerequisite: true,
        postrequisite: true,
        metadata: true,
      },
    });

    if (!relationship) {
      throw new NotFoundException('Relationship not found between these blocks');
    }

    await this.prisma.blockRelationship.delete({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
    });

    const formattedMetadata = formatRelationshipMetadata(relationship.metadata);

    return {
      id: relationship.id,
      prerequisite: relationship.prerequisite,
      postrequisite: relationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }
}