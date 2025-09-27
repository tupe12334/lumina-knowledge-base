import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Degree } from '../models/Degree.entity';

type OptionalString = string | null;

/**
 * Service for managing degree relationships.
 * Handles operations related to degree relationships with faculties and courses.
 */
@Injectable()
export class DegreesRelationshipService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Sets or clears the faculty for a given degree.
   * @param degreeId - The degree to update
   * @param facultyId - The faculty to assign (null to clear)
   * @returns Updated Degree with relations
   */
  async setFacultyForDegree(
    degreeId: string,
    facultyId: OptionalString,
  ): Promise<Degree> {
    await this.prisma.degree.update({
      where: { id: degreeId },
      data: {
        facultyId:
          facultyId !== null && facultyId !== undefined ? facultyId : null,
      },
    });

    const updated = await this.prisma.degree.findUnique({
      where: { id: degreeId },
      include: {
        name: true,
        institution: { include: { name: true } },
        faculty: { include: { name: true, description: true } },
        courses: { include: { name: true } },
      },
    });

    if (!updated) {
      throw new NotFoundException('Degree not found after update');
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
        institution: { include: { name: true } },
        faculty: { include: { name: true, description: true } },
        courses: { include: { name: true } },
      },
    });

    if (!updatedDegree) {
      throw new NotFoundException('Degree not found after update'); // Should not happen if degree was found initially
    }

    return updatedDegree;
  }

  /**
   * Removes a course from a degree.
   * @param degreeId - The ID of the degree to remove the course from.
   * @param courseId - The ID of the course to remove.
   * @returns The updated degree with the course removed.
   */
  async removeCourse(degreeId: string, courseId: string): Promise<Degree> {
    // Validate that the degree exists
    const degree = await this.prisma.degree.findUnique({
      where: { id: degreeId },
      include: {
        courses: {
          where: { id: courseId },
        },
      },
    });

    if (!degree) {
      throw new NotFoundException(`Degree with ID ${degreeId} not found`);
    }

    // Check if the course is actually connected to this degree
    if (degree.courses.length === 0) {
      throw new NotFoundException(
        `Course with ID ${courseId} is not associated with degree ${degreeId}`
      );
    }

    // Disconnect the course from the degree
    await this.prisma.degree.update({
      where: { id: degreeId },
      data: {
        courses: {
          disconnect: { id: courseId },
        },
      },
    });

    // Fetch the updated degree with all its relations
    const updatedDegree = await this.prisma.degree.findUnique({
      where: { id: degreeId },
      include: {
        name: true,
        institution: { include: { name: true } },
        faculty: { include: { name: true, description: true } },
        courses: { include: { name: true } },
      },
    });

    if (!updatedDegree) {
      throw new NotFoundException('Degree not found after update'); // Should not happen if degree was found initially
    }

    return updatedDegree;
  }

  /**
   * Gets all courses associated with a specific degree.
   * @param degreeId - The degree ID
   * @returns Array of courses for the degree
   * @throws NotFoundException if the degree doesn't exist
   */
  async getCoursesByDegreeId(degreeId: string) {
    const degree = await this.prisma.degree.findUnique({
      where: { id: degreeId },
      include: {
        courses: {
          include: {
            name: true,
          },
        },
      },
    });

    if (!degree) {
      throw new NotFoundException(`Degree with ID ${degreeId} not found`);
    }

    return degree.courses;
  }
}