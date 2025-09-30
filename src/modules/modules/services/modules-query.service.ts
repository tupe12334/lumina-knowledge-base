import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Module as ModuleEntity } from '../models/Module.entity';
import { ModulesQueryDto } from '../dto/modules-query.dto';
import { ModulesQueryBuilderService } from './modules-query-builder.service';
import { ModulesFilterService } from './modules-filter.service';
import { ModulesIncludesService } from './modules-includes.service';

@Injectable()
export class ModulesQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBuilder: ModulesQueryBuilderService,
    private readonly filterService: ModulesFilterService,
    private readonly includesService: ModulesIncludesService,
  ) {}

  async findUnique(id: string): Promise<any> {
    const result = await this.prisma.module.findUnique({
      where: { id },
      include: this.includesService.getDetailedInclude(),
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async findAll(filters?: ModulesQueryDto) {
    // Use course modules include when courseId is provided to get Block relationships
    const include = filters?.courseId
      ? this.includesService.getCourseModulesInclude()
      : this.includesService.getBaseInclude();
    const whereClause = this.queryBuilder.buildWhereClause(filters);

    if (this.filterService.needsQuestionCount(filters)) {
      return this.filterService.findAllWithComplexFilters(
        filters!,
        include,
        whereClause,
      );
    }

    return this.prisma.module.findMany({
      where: whereClause,
      include: include,
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
      include: this.includesService.getCourseModulesInclude(),
    });
  }
}