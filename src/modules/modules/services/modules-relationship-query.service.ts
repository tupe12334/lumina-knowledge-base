import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

interface ModuleWithBlock {
  id: string;
  Block: { id: string };
}

@Injectable()
export class ModulesRelationshipQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findRelationshipForDeletion(prerequisite: ModuleWithBlock, postrequisite: ModuleWithBlock) {
    const relationship = await this.prisma.blockRelationship.findUnique({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisite.Block.id,
          postrequisiteId: postrequisite.Block.id,
        },
      },
      include: {
        prerequisite: {
          include: {
            Module: { include: { name: true } },
          },
        },
        postrequisite: {
          include: {
            Module: { include: { name: true } },
          },
        },
        metadata: true,
      },
    });

    if (!relationship) {
      throw new NotFoundException(
        'Relationship not found between these modules',
      );
    }

    return relationship;
  }

  async checkRelationshipExists(prerequisite: ModuleWithBlock, postrequisite: ModuleWithBlock): Promise<void> {
    const existingRelationship = await this.prisma.blockRelationship.findUnique({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisite.Block.id,
          postrequisiteId: postrequisite.Block.id,
        },
      },
    });

    if (existingRelationship) {
      throw new BadRequestException(
        'Relationship already exists between these modules',
      );
    }
  }
}