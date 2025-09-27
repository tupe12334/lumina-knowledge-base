import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RelationshipMetadataKey } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateModuleRelationshipInput } from '../dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from '../dto/delete-module-relationship.input';
import { ModuleRelationshipResult } from '../dto/module-relationship-result.type';

function createValidMetadataEntries(metadata: Record<string, unknown>) {
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
export class ModulesRelationshipService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a prerequisite/postrequisite relationship between two modules.
   * @param relationshipData - The relationship data containing module IDs and optional metadata
   * @returns The created relationship with full details
   */
  async createModuleRelationship(
    relationshipData: CreateModuleRelationshipInput,
  ): Promise<ModuleRelationshipResult> {
    const { prerequisiteModuleId, postrequisiteModuleId, metadata } =
      relationshipData;

    if (prerequisiteModuleId === postrequisiteModuleId) {
      throw new BadRequestException(
        'A module cannot be a prerequisite to itself',
      );
    }

    // Validate that both modules exist
    const [prerequisiteModule, postrequisiteModule] = await Promise.all([
      this.prisma.module.findUnique({
        where: { id: prerequisiteModuleId },
        include: { Block: true },
      }),
      this.prisma.module.findUnique({
        where: { id: postrequisiteModuleId },
        include: { Block: true },
      }),
    ]);

    if (!prerequisiteModule) {
      throw new NotFoundException(
        `Prerequisite module with ID ${prerequisiteModuleId} not found`,
      );
    }

    if (!postrequisiteModule) {
      throw new NotFoundException(
        `Postrequisite module with ID ${postrequisiteModuleId} not found`,
      );
    }

    // Check if relationship already exists
    const existingRelationship = await this.prisma.blockRelationship.findUnique(
      {
        where: {
          prerequisiteId_postrequisiteId: {
            prerequisiteId: prerequisiteModule.Block.id,
            postrequisiteId: postrequisiteModule.Block.id,
          },
        },
      },
    );

    if (existingRelationship) {
      throw new BadRequestException(
        'Relationship already exists between these modules',
      );
    }

    // Create the relationship
    const relationship = await this.prisma.blockRelationship.create({
      data: {
        prerequisiteId: prerequisiteModule.Block.id,
        postrequisiteId: postrequisiteModule.Block.id,
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

    // Format metadata for response
    const formattedMetadata =
      relationship.metadata ? relationship.metadata.reduce(
        (acc, meta) => {
          acc[meta.key] = meta.value;
          return acc;
        },
        {} satisfies Record<string, string>,
      ) : {};

    return {
      id: relationship.id,
      prerequisite: relationship.prerequisite,
      postrequisite: relationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }

  /**
   * Delete a prerequisite/postrequisite relationship between two modules.
   * @param relationshipData - Data for deleting the relationship
   * @returns The deleted relationship details
   */
  async deleteModuleRelationship(
    relationshipData: DeleteModuleRelationshipInput,
  ): Promise<ModuleRelationshipResult> {
    const { prerequisiteModuleId, postrequisiteModuleId } = relationshipData;

    // Validate that both modules exist and get their blocks
    const [prerequisiteModule, postrequisiteModule] = await Promise.all([
      this.prisma.module.findUnique({
        where: { id: prerequisiteModuleId },
        include: { Block: true },
      }),
      this.prisma.module.findUnique({
        where: { id: postrequisiteModuleId },
        include: { Block: true },
      }),
    ]);

    if (!prerequisiteModule) {
      throw new NotFoundException(
        `Prerequisite module with ID ${prerequisiteModuleId} not found`,
      );
    }

    if (!postrequisiteModule) {
      throw new NotFoundException(
        `Postrequisite module with ID ${postrequisiteModuleId} not found`,
      );
    }

    // Find the relationship
    const relationship = await this.prisma.blockRelationship.findUnique({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteModule.Block.id,
          postrequisiteId: postrequisiteModule.Block.id,
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

    // Format metadata for response
    const formattedMetadata = relationship.metadata.reduce(
      (acc, meta) => {
        acc[meta.key] = meta.value;
        return acc;
      },
      {} satisfies Record<string, string>,
    );

    // Delete the relationship (this will cascade delete the metadata)
    await this.prisma.blockRelationship.delete({
      where: { id: relationship.id },
    });

    return {
      id: relationship.id,
      prerequisite: relationship.prerequisite,
      postrequisite: relationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }
}