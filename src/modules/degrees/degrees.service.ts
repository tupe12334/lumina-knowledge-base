import { Injectable, NotFoundException } from '@nestjs/common';
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
        ...(query?.name
          ? {
              name: {
                en_text: {
                  contains: query?.name,
                },
              },
            }
          : {}),
        ...(query?.facultyId ? { facultyId: query.facultyId } : {}),
        ...(query?.universityId ? { universityId: query.universityId } : {}),
      },
      include: {
        name: true,
        university: {
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
        university: {
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
   * Sets or clears the faculty for a given degree.
   * @param degreeId - The degree to update
   * @param facultyId - The faculty to assign (null to clear)
   * @returns Updated Degree with relations
   */
  async setFacultyForDegree(
    degreeId: string,
    facultyId: string | null,
  ): Promise<Degree> {
    await this.prisma.degree.update({
      where: { id: degreeId },
      data: { facultyId: facultyId ?? null },
    });

    const updated = await this.prisma.degree.findUnique({
      where: { id: degreeId },
      include: {
        name: true,
        university: { include: { name: true } },
        faculty: { include: { name: true, description: true } },
        courses: { include: { name: true } },
      },
    });

    if (!updated) {
      throw new Error('Degree not found after update');
    }

    return updated;
  }

  /**
   * Adds a course to a degree.
   * @param degreeId - The ID of the degree to add the course to.
   * @param courseId - The ID of the course to add.
   * @returns The updated degree with the course added.
   */
  async addCourse(degreeId: string, courseId: string): Promise<Degree> {
    // Validate that the degree exists
    const degree = await this.prisma.degree.findUnique({
      where: { id: degreeId },
    });

    if (!degree) {
      throw new NotFoundException(`Degree with ID ${degreeId} not found`);
    }

    // Validate that the course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Connect the course to the degree
    await this.prisma.degree.update({
      where: { id: degreeId },
      data: {
        courses: {
          connect: { id: courseId },
        },
      },
    });

    // Fetch the updated degree with all its relations
    const updatedDegree = await this.prisma.degree.findUnique({
      where: { id: degreeId },
      include: {
        name: true,
        university: { include: { name: true } },
        faculty: { include: { name: true, description: true } },
        courses: { include: { name: true } },
      },
    });

    if (!updatedDegree) {
      throw new Error('Degree not found after update'); // Should not happen if degree was found initially
    }

    return updatedDegree;
  }
}
