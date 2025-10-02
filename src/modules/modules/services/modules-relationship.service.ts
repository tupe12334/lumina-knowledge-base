import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateModuleRelationshipInput } from '../dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from '../dto/delete-module-relationship.input';
import { ModuleRelationshipResult } from '../dto/module-relationship-result.type';
import { ModulesRelationshipHelperService } from './modules-relationship-helper.service';
import { formatMetadata } from '../utils/relationship-metadata.utils';

@Injectable()
export class ModulesRelationshipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helper: ModulesRelationshipHelperService,
  ) {}

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

    this.helper.validateModuleIds(prerequisiteModuleId, postrequisiteModuleId);

    const modules = await this.helper.validateModulesExist(
      prerequisiteModuleId,
      postrequisiteModuleId,
    );

    await this.helper.checkRelationshipExists(modules.prerequisite, modules.postrequisite);

    const relationship = await this.helper.createRelationship(
      modules.prerequisite,
      modules.postrequisite,
      metadata,
    );

    return this.formatRelationshipResult(relationship);
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

    const modules = await this.helper.validateModulesExist(
      prerequisiteModuleId,
      postrequisiteModuleId,
    );

    const relationship = await this.helper.findRelationshipForDeletion(
      modules.prerequisite,
      modules.postrequisite,
    );

    const formattedMetadata = formatMetadata(relationship.metadata);

    await this.helper.deleteRelationship(relationship.id);

    return {
      id: relationship.id,
      prerequisite: relationship.prerequisite,
      postrequisite: relationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }

  private formatRelationshipResult(relationship: any): ModuleRelationshipResult {
    const formattedMetadata = formatMetadata(relationship.metadata);

    return {
      id: relationship.id,
      prerequisite: relationship.prerequisite,
      postrequisite: relationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }
}