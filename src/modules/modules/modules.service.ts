import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, RelationshipMetadataKey } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Module as ModuleEntity } from './models/Module.entity';
import { ModulesQueryDto } from './dto/modules-query.dto';
import { CreateModuleRelationshipInput } from './dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from './dto/delete-module-relationship.input';
import { ModuleRelationshipResult } from './dto/module-relationship-result.type';
import { CreateModuleInput } from './dto/create-module.input';
import { UpdateModuleInput } from './dto/update-module.input';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(id: string): Promise<ModuleEntity | null> {
    const result = await this.prisma.module.findUnique({
      where: { id },
      include: {
        name: true,
        Block: {
          include: {
            prerequisiteFor: {
              include: {
                postrequisite: {
                  include: {
                    Module: {
                      include: {
                        name: true,
                        Block: {
                          include: {
                            prerequisiteFor: true,
                            postrequisiteOf: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            postrequisiteOf: {
              include: {
                prerequisite: {
                  include: {
                    Module: {
                      include: {
                        name: true,
                        Block: {
                          include: {
                            prerequisiteFor: true,
                            postrequisiteOf: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        subModules: {
          include: {
            name: true,
            Block: {
              include: {
                prerequisiteFor: true,
                postrequisiteOf: true,
              },
            },
            subModules: {
              include: {
                name: true,
                Block: {
                  include: {
                    prerequisiteFor: true,
                    postrequisiteOf: true,
                  },
                },
              },
            },
          },
        },
        parentModules: { include: { name: true } },
      },
    });
    return result as ModuleEntity | null;
  }

  async findAll(filters?: ModulesQueryDto): Promise<ModuleEntity[]> {
    const baseInclude: Prisma.ModuleInclude = {
      name: true,
      Block: {
        include: {
          prerequisiteFor: true,
          postrequisiteOf: true,
        },
      },
      subModules: {
        include: {
          name: true,
          subModules: { include: { name: true } },
        },
      },
      parentModules: { include: { name: true } },
    };

    // Build the where clause based on filters
    const whereClause = this.buildWhereClause(filters);

    // Check if we need to include question count for filtering
    const needsQuestionCount =
      this.shouldFilterByQuestionCount(filters) ||
      filters?.hasQuestions !== undefined;

    if (needsQuestionCount) {
      return this.findAllWithComplexFilters(filters!, baseInclude, whereClause);
    }

    const modules = await this.prisma.module.findMany({
      where: whereClause,
      include: baseInclude,
    });
    return modules as unknown as ModuleEntity[];
  }

  private shouldFilterByQuestionCount(filters?: ModulesQueryDto): boolean {
    return !!(
      filters?.minQuestions !== undefined ||
      filters?.maxQuestions !== undefined ||
      filters?.exactQuestions !== undefined
    );
  }

  private buildWhereClause(filters?: ModulesQueryDto): Prisma.ModuleWhereInput {
    if (!filters) return {};

    const where: Prisma.ModuleWhereInput = {};

    // Course filter
    if (filters.courseId) {
      where.Course = {
        some: {
          id: filters.courseId,
        },
      };
    }

    // University filter (through courses)
    if (filters.universityId) {
      where.Course = {
        some: {
          universityId: filters.universityId,
        },
      };
    }

    // Name search filter (SQLite doesn't support case insensitive mode, so we'll handle it in post-processing)
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

    // Prerequisites and Postrequisites filters
    if (
      filters.hasPrerequisites !== undefined ||
      filters.hasPostrequisites !== undefined
    ) {
      const blockWhere: any = {};

      if (filters.hasPrerequisites !== undefined) {
        if (filters.hasPrerequisites) {
          blockWhere.postrequisiteOf = { some: {} };
        } else {
          blockWhere.postrequisiteOf = { none: {} };
        }
      }

      if (filters.hasPostrequisites !== undefined) {
        if (filters.hasPostrequisites) {
          blockWhere.prerequisiteFor = { some: {} };
        } else {
          blockWhere.prerequisiteFor = { none: {} };
        }
      }

      where.Block = blockWhere;
    }

    // Sub-modules filter
    if (filters.hasSubModules !== undefined) {
      if (filters.hasSubModules) {
        where.subModules = {
          some: {},
        };
      } else {
        where.subModules = {
          none: {},
        };
      }
    }

    // Parent modules filter
    if (filters.hasParentModules !== undefined) {
      if (filters.hasParentModules) {
        where.parentModules = {
          some: {},
        };
      } else {
        where.parentModules = {
          none: {},
        };
      }
    }

    return where;
  }

  private async findAllWithComplexFilters(
    filters: ModulesQueryDto,
    baseInclude: Prisma.ModuleInclude,
    whereClause: Prisma.ModuleWhereInput,
  ): Promise<ModuleEntity[]> {
    const modules = await this.prisma.module.findMany({
      where: whereClause,
      include: {
        ...baseInclude,
        _count: {
          select: {
            Questions: true,
          },
        },
      },
    });

    const filteredModules = modules.filter((module) => {
      const questionCount = module._count.Questions;

      // Question count filters
      if (filters.exactQuestions !== undefined) {
        if (questionCount !== filters.exactQuestions) return false;
      } else {
        const meetsMinRequirement =
          filters.minQuestions === undefined ||
          questionCount >= filters.minQuestions;

        const meetsMaxRequirement =
          filters.maxQuestions === undefined ||
          questionCount <= filters.maxQuestions;

        if (!meetsMinRequirement || !meetsMaxRequirement) return false;
      }

      // Has questions filter
      if (filters.hasQuestions !== undefined) {
        const hasQuestions = questionCount > 0;
        if (hasQuestions !== filters.hasQuestions) return false;
      }

      return true;
    });

    // Remove the _count property before returning
    return filteredModules.map((module) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _count, ...moduleWithoutCount } = module;
      return moduleWithoutCount;
    }) as unknown as ModuleEntity[];
  }

  /**
   * Creates a new module.
   * @param input - The data for creating the module
   * @returns The newly created module
   */
  async create(input: CreateModuleInput): Promise<ModuleEntity> {
    const { en_text, he_text, courseId } = input;

    // Validate that the course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Create a new translation for the module name
    const translation = await this.prisma.translation.create({
      data: {
        en_text,
        he_text,
      },
    });

    // Create a new block for the module
    const block = await this.prisma.block.create({
      data: {},
    });

    // Create the module, linking it to the translation, block, and course
    const module = await this.prisma.module.create({
      data: {
        translationId: translation.id,
        blockId: block.id,
        Course: {
          connect: { id: courseId },
        },
      },
      include: {
        name: true,
        Block: true,
      },
    });

    return module as ModuleEntity;
  }

  async update(id: string, updateModuleInput: UpdateModuleInput) {
    return this.prisma.module.update({
      where: { id },
      data: updateModuleInput,
    });
  }

  async delete(id: string) {
    return this.prisma.module.delete({ where: { id } });
  }

  async findModulesByCourseId(courseId: string): Promise<ModuleEntity[]> {
    return this.prisma.module.findMany({
      where: {
        Course: {
          some: {
            id: courseId,
          },
        },
      },
      include: {
        name: true,
        Block: {
          include: {
            prerequisiteFor: true,
            postrequisiteOf: true,
          },
        },
        subModules: {
          include: {
            name: true,
            subModules: { include: { name: true } },
          },
        },
        parentModules: { include: { name: true } },
      },
    });
  }

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
              create: Object.entries(metadata).map(([key, value]) => ({
                key: key as RelationshipMetadataKey,
                value: String(value),
              })),
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
      relationship.metadata?.reduce(
        (acc, meta) => {
          acc[meta.key] = meta.value;
          return acc;
        },
        {} as Record<string, string>,
      ) || {};

    return {
      id: relationship.id,
      prerequisite: relationship.prerequisite,
      postrequisite: relationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }

  /**
   * Delete a prerequisite/postrequisite relationship between two modules.
   *
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
      {} as Record<string, string>,
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
