import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Degree } from '../models/Degree.entity';
import { DegreesQueryDto } from '../dto/degrees-query.dto';
import { DegreesIncludesService } from './degrees-includes.service';
import { DegreesQueryBuilderService } from './degrees-query-builder.service';

type DegreeWithBaseInclude = Prisma.DegreeGetPayload<{
  include: ReturnType<DegreesIncludesService['getBaseInclude']>;
}>;

type DegreeWithDetailedInclude = Prisma.DegreeGetPayload<{
  include: ReturnType<DegreesIncludesService['getDetailedInclude']>;
}>;

@Injectable()
export class DegreesQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly includesService: DegreesIncludesService,
    private readonly queryBuilder: DegreesQueryBuilderService,
  ) {}

  /**
   * Retrieves all degrees from the database.
   * Includes related university and course information.
   * @returns Promise<Degree[]> Array of all degrees
   */
  async findAll(query?: DegreesQueryDto): Promise<DegreeWithBaseInclude[]> {
    const degrees = await this.prisma.degree.findMany({
      where: this.queryBuilder.buildWhereClause(query),
      include: this.includesService.getBaseInclude(),
    });

    // For minCourseCount > 1, filter the results after querying
    if (query && query.minCourseCount !== undefined && query.minCourseCount > 1) {
      return degrees.filter(degree => degree.courses.length >= query.minCourseCount!);
    }

    return degrees;
  }

  /**
   * Retrieves a specific degree by its ID.
   * Includes related university and course information.
   * @param id - The unique identifier of the degree
   * @returns Promise<Degree | null> The degree if found, null otherwise
   */
  async findUnique(id: string): Promise<DegreeWithDetailedInclude | null> {
    const degree = await this.prisma.degree.findUnique({
      where: { id },
      include: this.includesService.getDetailedInclude(),
    });

    if (!degree) {
      return null;
    }

    return degree;
  }

  /**
   * Retrieves all degrees for a specific university.
   * @param universityId - The unique identifier of the university
   * @returns Promise<Degree[]> Array of degrees for the specified university
   */
  async findByUniversityId(institutionId: string): Promise<DegreeWithDetailedInclude[]> {
    return this.prisma.degree.findMany({
      where: { institutionId },
      include: this.includesService.getDetailedInclude(),
    });
  }

  async findByFacultyId(facultyId: string): Promise<DegreeWithDetailedInclude[]> {
    return this.prisma.degree.findMany({
      where: { facultyId },
      include: this.includesService.getDetailedInclude(),
    });
  }
}