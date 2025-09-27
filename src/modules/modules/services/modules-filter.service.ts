import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ModulesQueryDto } from '../dto/modules-query.dto';
import { ModulesQuestionFilterService } from './modules-question-filter.service';

type ModuleWithCount = any & { _count: { Questions: number } };

@Injectable()
export class ModulesFilterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionFilter: ModulesQuestionFilterService,
  ) {}

  shouldFilterByQuestionCount(filters?: ModulesQueryDto): boolean {
    return Boolean(
      filters &&
        (filters.minQuestions !== undefined ||
          filters.maxQuestions !== undefined ||
          filters.exactQuestions !== undefined),
    );
  }

  needsQuestionCount(filters?: ModulesQueryDto): boolean {
    return Boolean(
      this.shouldFilterByQuestionCount(filters) ||
      (filters && filters.hasQuestions !== undefined) ||
      (filters && filters.fewQuestions !== undefined)
    );
  }

  async findAllWithComplexFilters(
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

    const filteredModules = modules.filter((module: ModuleWithCount) =>
      this.questionFilter.passesQuestionFilters(module, filters),
    );

    return filteredModules.map((module: ModuleWithCount) => {
      const { _count, ...moduleWithoutCount } = module;
      return moduleWithoutCount;
    });
  }
}