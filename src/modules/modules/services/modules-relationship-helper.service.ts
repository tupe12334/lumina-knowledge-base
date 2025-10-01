import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { createValidMetadataEntries } from '../utils/relationship-metadata.utils';
import { ModulesRelationshipQueryService } from './modules-relationship-query.service';

interface ModuleWithBlock {
  id: string;
  Block: { id: string };
}

@Injectable()
export class ModulesRelationshipHelperService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryService: ModulesRelationshipQueryService,
  ) {}

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

  async checkRelationshipExists(prerequisite: ModuleWithBlock, postrequisite: ModuleWithBlock): Promise<void> {
    return this.queryService.checkRelationshipExists(prerequisite, postrequisite);
  }

  async createRelationship(prerequisite: ModuleWithBlock, postrequisite: ModuleWithBlock, metadata?: Record<string, unknown>) {
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


  async findRelationshipForDeletion(prerequisite: ModuleWithBlock, postrequisite: ModuleWithBlock) {
    return this.queryService.findRelationshipForDeletion(prerequisite, postrequisite);
  }

  async deleteRelationship(relationshipId: string): Promise<void> {
    await this.prisma.blockRelationship.delete({
      where: { id: relationshipId },
    });
  }
}