import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DegreesQueryDto } from '../dto/degrees-query.dto';

@Injectable()
export class DegreesQueryBuilderService {
  buildWhereClause(query?: DegreesQueryDto): Prisma.DegreeWhereInput {
    if (!query) return {};

    const where: Prisma.DegreeWhereInput = {};

    this.applyNameFilter(where, query);
    this.applyFacultyFilter(where, query);
    this.applyUniversityFilter(where, query);
    this.applyCourseCountFilter(where, query);

    return where;
  }

  private applyNameFilter(
    where: Prisma.DegreeWhereInput,
    query: DegreesQueryDto,
  ): void {
    if (query.name) {
      where.name = {
        OR: [
          {
            en_text: {
              contains: query.name,
            },
          },
          {
            he_text: {
              contains: query.name,
            },
          },
        ],
      };
    }
  }

  private applyFacultyFilter(
    where: Prisma.DegreeWhereInput,
    query: DegreesQueryDto,
  ): void {
    if (query.facultyId) {
      where.facultyId = query.facultyId;
    }
  }

  private applyUniversityFilter(
    where: Prisma.DegreeWhereInput,
    query: DegreesQueryDto,
  ): void {
    if (query.universityId) {
      where.institutionId = query.universityId;
    }
  }

  private applyCourseCountFilter(
    where: Prisma.DegreeWhereInput,
    query: DegreesQueryDto,
  ): void {
    if (query.minCourseCount !== undefined && query.minCourseCount > 0) {
      where.courses = {
        some: {},
      };
    }
  }
}