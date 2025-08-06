import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Degree } from './models/Degree.entity';
import { DegreesQueryDto } from './dto/degrees-query.dto';

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
  async findAll(query?: DegreesQueryDto): Promise<Degree[]> {
    const degrees = await this.prisma.degree.findMany({
      where: {
        name: {
          en_text: {
            contains: query?.name,
          },
        },
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
          },
        },
      },
    });

    return degrees;
  }
}
