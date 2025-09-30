import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBlockRelationshipInput } from '../dto/create-block-relationship.input';
import { createValidMetadataEntries } from '../helpers/create-valid-metadata-entries.helper';

type RelationshipWithIncludes = Prisma.BlockRelationshipGetPayload<{
  include: { prerequisite: true; postrequisite: true; metadata: true };
}>;

@Injectable()
export class BlocksRelationshipQueryService {
  constructor(private readonly prisma: PrismaService) {}

  private getRelationshipInclude() {
    return {
      prerequisite: true,
      postrequisite: true,
      metadata: true,
    };
  }

  async createRelationship(relationshipData: CreateBlockRelationshipInput): Promise<RelationshipWithIncludes> {
    const { prerequisiteBlockId, postrequisiteBlockId, metadata } = relationshipData;

    return this.prisma.blockRelationship.create({
      data: {
        prerequisiteId: prerequisiteBlockId,
        postrequisiteId: postrequisiteBlockId,
        metadata: metadata ? { create: createValidMetadataEntries(metadata) } : undefined,
      },
      include: this.getRelationshipInclude(),
    });
  }

  async findRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string): Promise<RelationshipWithIncludes> {
    const relationship = await this.prisma.blockRelationship.findUnique({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
      include: this.getRelationshipInclude(),
    });

    if (!relationship) {
      throw new NotFoundException('Relationship not found between these blocks');
    }

    return relationship;
  }

  async deleteRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string): Promise<void> {
    await this.prisma.blockRelationship.delete({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
    });
  }
}