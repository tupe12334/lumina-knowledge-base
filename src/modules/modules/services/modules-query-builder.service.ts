import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ModulesQueryDto } from '../dto/modules-query.dto';

@Injectable()
export class ModulesQueryBuilderService {
  buildWhereClause(filters?: ModulesQueryDto): Prisma.ModuleWhereInput {
    if (!filters) return {};

    const where: Prisma.ModuleWhereInput = {};

    this.applyBasicFilters(where, filters);
    this.applyRelationshipFilters(where, filters);
    this.applyModuleHierarchyFilters(where, filters);

    return where;
  }

  private applyBasicFilters(
    where: Prisma.ModuleWhereInput,
    filters: ModulesQueryDto,
  ): void {
    if (filters.courseId) {
      where.Course = {
        some: {
          id: filters.courseId,
        },
      };
    }

    if (filters.universityId) {
      where.Course = {
        some: {
          institutionId: filters.universityId,
        },
      };
    }

    if (filters.nameSearch) {
      where.name = {
        OR: [
          {
            en_text: {
              contains: filters.nameSearch,
            },
          },
          {
            he_text: {
              contains: filters.nameSearch,
            },
          },
        ],
      };
    }
  }

  private applyRelationshipFilters(
    where: Prisma.ModuleWhereInput,
    filters: ModulesQueryDto,
  ): void {
    if (
      filters.hasPrerequisites !== undefined ||
      filters.hasPostrequisites !== undefined
    ) {
      const blockWhere: Prisma.BlockWhereInput = {};

      if (filters.hasPrerequisites !== undefined) {
        blockWhere.postrequisiteOf = filters.hasPrerequisites ? { some: {} } : { none: {} };
      }

      if (filters.hasPostrequisites !== undefined) {
        blockWhere.prerequisiteFor = filters.hasPostrequisites ? { some: {} } : { none: {} };
      }

      where.Block = blockWhere;
    }
  }

  private applyModuleHierarchyFilters(
    where: Prisma.ModuleWhereInput,
    filters: ModulesQueryDto,
  ): void {
    if (filters.hasSubModules !== undefined) {
      where.subModules = filters.hasSubModules ? { some: {} } : { none: {} };
    }

    if (filters.hasParentModules !== undefined) {
      where.parentModules = filters.hasParentModules ? { some: {} } : { none: {} };
    }
  }
}