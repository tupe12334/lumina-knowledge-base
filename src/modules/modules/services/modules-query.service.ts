import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Module as ModuleEntity } from '../models/Module.entity';
import { ModulesQueryDto } from '../dto/modules-query.dto';

@Injectable()
export class ModulesQueryService {
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
                      },
                    },
                  },
                },
                metadata: true,
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
                metadata: true,
              },
            },
          },
        },
        Questions: {
          include: {
            text: true,
            Answer: {
              include: {
                SelectAnswer: true,
                UnitAnswer: true,
                NumberAnswer: true,
                BooleanAnswer: true,
              },
            },
            Parts: true,
          },
        },
        Course: {
          include: {
            name: true,
            institution: {
              include: {
                name: true,
              },
            },
          },
        },
        subModules: { include: { name: true } },
        parentModules: { include: { name: true } },
      },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async findAll(filters?: ModulesQueryDto) {
    const baseInclude: Prisma.ModuleInclude = {
      name: true,
      Course: {
        include: {
          name: true,
          institution: {
            include: {
              name: true,
            },
          },
        },
      },
      subModules: { include: { name: true } },
      parentModules: { include: { name: true } },
    };

    const whereClause: Prisma.ModuleWhereInput = this.buildWhereClause(filters);

    const needsQuestionCount =
      this.shouldFilterByQuestionCount(filters) ||
      (filters && filters.hasQuestions !== undefined) ||
      (filters && filters.fewQuestions !== undefined);

    if (needsQuestionCount) {
      return this.findAllWithComplexFilters(filters!, baseInclude, whereClause);
    }

    return this.prisma.module.findMany({
      where: whereClause,
      include: baseInclude,
    });
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
        Course: {
          include: {
            name: true,
            institution: {
              include: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  private shouldFilterByQuestionCount(filters?: ModulesQueryDto): boolean {
    return Boolean(
      filters &&
        (filters.minQuestions !== undefined ||
          filters.maxQuestions !== undefined ||
          filters.exactQuestions !== undefined)
    );
  }

  private buildWhereClause(filters?: ModulesQueryDto): Prisma.ModuleWhereInput {
    if (!filters) return {};

    const where: Prisma.ModuleWhereInput = {};

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

      if (filters.hasQuestions !== undefined) {
        const hasQuestions = questionCount > 0;
        if (hasQuestions !== filters.hasQuestions) {
          return false;
        }
      }

      if (filters.fewQuestions !== undefined) {
        const hasFewQuestions = questionCount < 20;
        const fewQuestionsFilter = filters.fewQuestions;
        if (hasFewQuestions !== fewQuestionsFilter) {
          return false;
        }
      }

      return true;
    });

    return filteredModules.map((module) => {
      const { _count, ...moduleWithoutCount } = module;
      return moduleWithoutCount;
    });
  }
}