import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, RelationshipMetadataKey } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Module as ModuleEntity } from './models/Module.entity';
import { ModulesQueryDto } from './dto/modules-query.dto';
import { CreateModuleRelationshipInput } from './dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from './dto/delete-module-relationship.input';
import { ModuleRelationshipResult } from './dto/module-relationship-result.type';
import { CreateModuleInput } from './dto/create-module.input';
import { CreateManyModulesInput } from './dto/create-many-modules.input';
import { UpdateModuleInput } from './dto/update-module.input';

/* eslint-disable @typescript-eslint/no-explicit-any */

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

type RelationshipWithIncludes = Prisma.BlockRelationshipGetPayload<{
  include: { prerequisite: true; postrequisite: true; metadata: true };
}>;

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
    return result satisfies ModuleEntity | null;
  }

  async findAll(filters?: ModulesQueryDto) {
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
    const whereClause: Prisma.ModuleWhereInput = this.buildWhereClause(filters);

    // Check if we need to include question count for filtering
    const needsQuestionCount =
      this.shouldFilterByQuestionCount(filters) ||
      (filters && filters.hasQuestions !== undefined) ||
      (filters && filters.fewQuestions !== undefined);

    if (needsQuestionCount) {
      return this.findAllWithComplexFilters(filters!, baseInclude, whereClause);
    }

    const modules = await this.prisma.module.findMany({
      where: whereClause,
      include: baseInclude,
    });
    // Return modules with inferred type - TypeScript will understand the structure
    return modules;
  }

  private shouldFilterByQuestionCount(filters?: ModulesQueryDto): boolean {
    return !!(
      (filters && filters.minQuestions !== undefined) ||
      (filters && filters.maxQuestions !== undefined) ||
      (filters && filters.exactQuestions !== undefined)
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
          institutionId: filters.universityId,
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
      const blockWhere: Prisma.BlockWhereInput = {};

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
  ) {
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
        if (questionCount !== filters.exactQuestions) {
          return false;
        }
      } else {
        const meetsMinRequirement =
          filters.minQuestions === undefined ||
          questionCount >= filters.minQuestions;

        const meetsMaxRequirement =
          filters.maxQuestions === undefined ||
          questionCount <= filters.maxQuestions;

        if (!meetsMinRequirement || !meetsMaxRequirement) {
          return false;
        }
      }

      // Has questions filter
      if (filters.hasQuestions !== undefined) {
        const hasQuestions = questionCount > 0;
        if (hasQuestions !== filters.hasQuestions) {
          return false;
        }
      }

      // Few questions filter (fewer than 20 questions)
      if (filters.fewQuestions !== undefined) {
        const hasFewQuestions = questionCount < 20;
        const fewQuestionsFilter = filters.fewQuestions;
        if (hasFewQuestions !== fewQuestionsFilter) {
          return false;
        }
      }

      return true;
    });

    // Remove the _count property before returning
    console.log(`DEBUG: Filtered modules count: ${filteredModules.length}`);
    return filteredModules.map((module) => {
      const { _count, ...moduleWithoutCount } = module;
      return moduleWithoutCount;
    });
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

    return module satisfies ModuleEntity;
  }

  async update(id: string, updateModuleInput: UpdateModuleInput) {
    return this.prisma.module.update({
      where: { id },
      data: updateModuleInput,
    });
  }

  /**
   * Creates multiple modules in a single transaction.
   * @param input - The data for creating multiple modules
   * @returns The number of modules created
   */
  async createMany(input: CreateManyModulesInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const moduleData of input.modules) {
        const { en_text, he_text, courseId } = moduleData;

        // Validate that the course exists
        const course = await prisma.course.findUnique({
          where: { id: courseId },
        });

        if (!course) {
          throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        // Create a new translation for the module name
        const translation = await prisma.translation.create({
          data: {
            en_text,
            he_text,
          },
        });

        // Create a new block for the module
        const block = await prisma.block.create({
          data: {},
        });

        // Create the module, linking it to the translation, block, and course
        await prisma.module.create({
          data: {
            translationId: translation.id,
            blockId: block.id,
            Course: {
              connect: { id: courseId },
            },
          },
        });

        createdCount++;
      }

      return { count: createdCount };
    });
  }

  async delete(id: string) {
    return this.prisma.module.delete({ where: { id } });
  }

  async findModulesByCourseId(courseId: string) {
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

  /**
   * Generates a human-readable summary of a module including its courses, questions, hierarchy, and prerequisites.
   * @param id - The module ID
   * @returns A plain text summary of the module
   * @throws NotFoundException if the module doesn't exist
   * @throws InternalServerErrorException if database operation fails
   */
  async generateSummary(id: string): Promise<string> {
    try {
      const module = await this.findModuleForSummary(id);

      if (!module) {
        throw new NotFoundException(`Module with ID ${id} not found`);
      }

      const summaryData = this.extractModuleSummaryData(module);
      return this.buildModuleSummary(module, summaryData);
    } catch (error: unknown) {
      if (error instanceof NotFoundException && error instanceof Error) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Failed to generate module summary: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async findModuleForSummary(id: string) {
    return this.prisma.module.findUnique({
      where: { id },
      include: {
        name: true,
        Course: {
          include: {
            name: true,
          },
        },
        Questions: true,
        parentModules: {
          include: {
            name: true,
          },
        },
        subModules: {
          include: {
            name: true,
          },
        },
        Block: {
          include: {
            prerequisiteFor: {
              include: {
                postrequisite: {
                  include: {
                    Module: {
                      include: {
                        name: true,
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
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  private extractModuleSummaryData(module: any) {
    const moduleName =
      (module.name && module.name.en_text) || 'No English translation available';

    const courseNames = module.Course.map(
      (course: any) => (course.name && course.name.en_text) || 'No English translation available',
    ).join(', ');

    const questionCount = module.Questions.length;
    const questionTypes = [
      ...new Set(module.Questions.map((q: any) => q.type)),
    ].join(', ');

    const parentModuleNames = module.parentModules
      .map(
        (parent: any) =>
          (parent.name && parent.name.en_text) || 'No English translation available',
      )
      .join(', ');

    const subModuleNames = module.subModules
      .map((sub: any) => (sub.name && sub.name.en_text) || 'No English translation available')
      .join(', ');

    const prerequisites = this.extractModulePrerequisites(module);
    const postrequisites = this.extractModulePostrequisites(module);

    return {
      moduleName,
      courseNames,
      questionCount,
      questionTypes,
      parentModuleNames,
      subModuleNames,
      prerequisites,
      postrequisites,
    };
  }

  private extractModulePrerequisites(module: any): string {
    if (!module.Block || !module.Block.postrequisiteOf) {
      return 'None';
    }

    const prerequisites = module.Block.postrequisiteOf
      .flatMap(
        (rel: any) =>
          (rel.prerequisite.Module && rel.prerequisite.Module.map(
            (m: any) => (m.name && m.name.en_text) || 'No English translation available',
          )) || [],
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return prerequisites || 'None';
  }

  private extractModulePostrequisites(module: any): string {
    if (!module.Block || !module.Block.prerequisiteFor) {
      return 'None';
    }

    const postrequisites = module.Block.prerequisiteFor
      .flatMap(
        (rel: any) =>
          (rel.postrequisite.Module && rel.postrequisite.Module.map(
            (m: any) => (m.name && m.name.en_text) || 'No English translation available',
          )) || [],
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return postrequisites || 'None';
  }

  private buildModuleSummary(module: any, data: any): string {
    return `Module: ${data.moduleName}
ID: ${module.id}
Associated Courses: ${data.courseNames || 'None'}
Questions: ${data.questionCount} questions of types ${data.questionTypes || 'None'}
Parent Modules: ${data.parentModuleNames || 'None'}
Sub-modules: ${data.subModuleNames || 'None'}
Prerequisites: ${data.prerequisites}
Postrequisites: ${data.postrequisites}`;
  }

  async getModulesSummary(): Promise<
    Array<{ id: string; en_name: string; questions_amount: number }>
  > {
    const modules = await this.prisma.module.findMany({
      include: {
        name: true,
        _count: {
          select: {
            Questions: true,
          },
        },
      },
    });

    return modules
      .map((module) => ({
        id: module.id,
        en_name: module.name.en_text,
        questions_amount: module._count.Questions,
      }))
      .sort((a, b) => a.questions_amount - b.questions_amount);
  }

  async getModulesByQuestionCount(limit?: number): Promise<
    Array<{ id: string; en_name: string; questions_amount: number }>
  > {
    const modules = await this.prisma.module.findMany({
      include: {
        name: true,
        _count: {
          select: {
            Questions: true,
          },
        },
      },
    });

    const sortedModules = modules
      .map((module) => ({
        id: module.id,
        en_name: module.name.en_text,
        questions_amount: module._count.Questions,
      }))
      .sort((a, b) => a.questions_amount - b.questions_amount);

    return limit ? sortedModules.slice(0, limit) : sortedModules;
  }
}
