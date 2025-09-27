import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RelationshipMetadataKey } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export function createValidMetadataEntries(metadata: Record<string, unknown>) {
  const validEntries: Array<{ key: RelationshipMetadataKey; value: string }> = [];
  for (const [key, value] of Object.entries(metadata)) {
    if (key === RelationshipMetadataKey.REASON ||
        key === RelationshipMetadataKey.TYPE ||
        key === RelationshipMetadataKey.DESCRIPTION) {
      const typedKey = key === RelationshipMetadataKey.REASON ? RelationshipMetadataKey.REASON :
                      key === RelationshipMetadataKey.TYPE ? RelationshipMetadataKey.TYPE :
                      RelationshipMetadataKey.DESCRIPTION;
      validEntries.push({ key: typedKey, value: String(value) });
    }
  }
  return validEntries;
}

@Injectable()
export class ModulesRelationshipHelperService {
  constructor(private readonly prisma: PrismaService) {}

  validateModuleIds(prerequisiteId: string, postrequisiteId: string): void {
    if (prerequisiteId === postrequisiteId) {
      throw new BadRequestException(
        'A module cannot be a prerequisite to itself',
      );
    }
  }

  async validateModulesExist(prerequisiteId: string, postrequisiteId: string) {
    const [prerequisiteModule, postrequisiteModule] = await Promise.all([
      this.prisma.module.findUnique({
        where: { id: prerequisiteId },
        include: { Block: true },
      }),
      this.prisma.module.findUnique({
        where: { id: postrequisiteId },
        include: { Block: true },
      }),
    ]);

    if (!prerequisiteModule) {
      throw new NotFoundException(
        `Prerequisite module with ID ${prerequisiteId} not found`,
      );
    }

    if (!postrequisiteModule) {
      throw new NotFoundException(
        `Postrequisite module with ID ${postrequisiteId} not found`,
      );
    }

    return { prerequisite: prerequisiteModule, postrequisite: postrequisiteModule };
  }

  async checkRelationshipExists(prerequisite: any, postrequisite: any): Promise<void> {
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

  async createRelationship(prerequisite: any, postrequisite: any, metadata?: Record<string, unknown>) {
    return this.prisma.blockRelationship.create({
      data: {
        prerequisiteId: prerequisite.Block.id,
        postrequisiteId: postrequisite.Block.id,
        metadata: metadata
          ? {
              create: createValidMetadataEntries(metadata),
            }
          : undefined,
      },
      include: {
        prerequisite: true,
        postrequisite: true,
        metadata: true,
      },
    });
  }

  formatMetadata(metadata: any[]): Record<string, string> {
    return metadata ? metadata.reduce(
      (acc: Record<string, string>, meta: any) => {
        acc[meta.key] = meta.value;
        return acc;
      },
      {} satisfies Record<string, string>,
    ) : {};
  }

  async findRelationshipForDeletion(prerequisite: any, postrequisite: any) {
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

  async deleteRelationship(relationshipId: string): Promise<void> {
    await this.prisma.blockRelationship.delete({
      where: { id: relationshipId },
    });
  }
}