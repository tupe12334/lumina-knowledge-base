import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Degree } from '../models/Degree.entity';
import { DegreesQueryDto } from '../dto/degrees-query.dto';

/**
 * Service for querying degrees.
 * Handles complex query operations for degrees.
 */
@Injectable()
export class DegreesQueryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all degrees from the database.
   * Includes related university and course information.
   * @returns Promise<Degree[]> Array of all degrees
   */
  async findAll(query?: DegreesQueryDto): Promise<Degree[]> {
    const degrees = await this.prisma.degree.findMany({
      where: {
        ...(query && query.name
          ? {
              name: {
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
              },
            }
          : {}),
        ...(query && query.facultyId ? { facultyId: query.facultyId } : {}),
        ...(query && query.universityId ? { institutionId: query.universityId } : {}),
        ...(query && query.minCourseCount !== undefined && query.minCourseCount > 0
          ? {
              courses: {
                some: {},
              },
            }
          : {}),
      },
      include: {
        name: true,
        institution: {
          include: {
            name: true,
          },
        },
        faculty: {
          include: {
            name: true,
            description: true,
          },
        },
        courses: {
          include: {
            name: true,
          },
        },
      },
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
  async findUnique(id: string): Promise<Degree | null> {
    const degree = await this.prisma.degree.findUnique({
      where: { id },
      include: {
        name: true,
        institution: {
          include: {
            name: true,
          },
        },
        faculty: {
          include: {
            name: true,
            description: true,
          },
        },
        courses: {
          include: {
            name: true,
            Block: {
              include: {
                postrequisiteOf: true,
                prerequisiteFor: true,
              },
            },
          },
        },
      },
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
  async findByUniversityId(institutionId: string): Promise<Degree[]> {
    const degrees = await this.prisma.degree.findMany({
      where: { institutionId },
      include: {
        name: true,
        institution: {
          include: {
            name: true,
          },
        },
        faculty: {
          include: {
            name: true,
            description: true,
          },
        },
        courses: {
          include: {
            name: true,
            Block: {
              include: {
                postrequisiteOf: true,
                prerequisiteFor: true,
              },
            },
          },
        },
      },
    });

    return degrees;
  }

  /**
   * Retrieves all degrees for a specific faculty.
   * @param facultyId - The unique identifier of the faculty
   * @returns Promise<Degree[]> Array of degrees for the specified faculty
   */
  async findByFacultyId(facultyId: string): Promise<Degree[]> {
    const degrees = await this.prisma.degree.findMany({
      where: { facultyId },
      include: {
        name: true,
        institution: {
          include: {
            name: true,
          },
        },
        faculty: {
          include: {
            name: true,
            description: true,
          },
        },
        courses: {
          include: {
            name: true,
            Block: {
              include: {
                postrequisiteOf: true,
                prerequisiteFor: true,
              },
            },
          },
        },
      },
    });

    return degrees;
  }
}