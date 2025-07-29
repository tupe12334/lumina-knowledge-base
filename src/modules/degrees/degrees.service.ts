import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Degree } from './models/Degree.entity';

/**
 * Service for managing degree operations.
 * Handles CRUD operations for degrees including retrieving degrees
 * with their associated university and courses.
 */
@Injectable()
export class DegreesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all degrees from the database.
   * Includes related university and course information.
   * @returns Promise<Degree[]> Array of all degrees
   */
  async findAll(): Promise<Degree[]> {
    const degrees = await this.prisma.degree.findMany({
      include: {
        name: true,
        university: {
          include: {
            name: true,
          },
        },
        courses: {
          include: {
            name: true,
            discipline: {
              include: {
                name: true,
              },
            },
          },
        },
      },
    });

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
        university: {
          include: {
            name: true,
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
            discipline: {
              include: {
                name: true,
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
  async findByUniversityId(universityId: string): Promise<Degree[]> {
    const degrees = await this.prisma.degree.findMany({
      where: { universityId },
      include: {
        name: true,
        university: {
          include: {
            name: true,
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
            discipline: {
              include: {
                name: true,
              },
            },
          },
        },
      },
    });

    return degrees;
  }

  /**
   * Retrieves all degrees for a specific university and discipline.
   * @param universityId - The unique identifier of the university
   * @param disciplineId - The unique identifier of the discipline
   * @returns Promise<Degree[]> Array of degrees for the specified university and discipline
   */
  async findByUniversityIdAndDisciplineId(
    universityId: string,
    disciplineId: string,
  ): Promise<Degree[]> {
    const degrees = await this.prisma.degree.findMany({
      where: {
        universityId,
        disciplineId,
      },
      include: {
        name: true,
        university: {
          include: {
            name: true,
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
            discipline: {
              include: {
                name: true,
              },
            },
          },
        },
      },
    });

    return degrees;
  }
}
