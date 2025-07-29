import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Module as ModuleEntity } from './models/Module.entity';
import { ModulesQueryDto } from './dto/modules-query.dto';

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
        LearningResource: {
          orderBy: { relevance: 'desc' },
        },
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
      LearningResource: {
        orderBy: { relevance: 'desc' },
      },
    };

    if (this.shouldFilterByQuestionCount(filters)) {
      return this.findAllWithQuestionCountFilter(filters!, baseInclude);
    }

    const modules = await this.prisma.module.findMany({
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

  private async findAllWithQuestionCountFilter(
    filters: ModulesQueryDto,
    baseInclude: Prisma.ModuleInclude,
  ): Promise<ModuleEntity[]> {
    const modules = await this.prisma.module.findMany({
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
        return questionCount === filters.exactQuestions;
      }

      const meetsMinRequirement =
        filters.minQuestions === undefined ||
        questionCount >= filters.minQuestions;

      const meetsMaxRequirement =
        filters.maxQuestions === undefined ||
        questionCount <= filters.maxQuestions;

      return meetsMinRequirement && meetsMaxRequirement;
    });

    // Remove the _count property before returning
    return filteredModules.map((module) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _count, ...moduleWithoutCount } = module;
      return moduleWithoutCount;
    }) as unknown as ModuleEntity[];
  }
}
