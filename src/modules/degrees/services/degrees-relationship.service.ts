import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Degree } from '../models/Degree.entity';
import { DegreesCourseRelationshipService } from './degrees-course-relationship.service';

type OptionalString = string | null;

/**
 * Service for managing degree relationships.
 * Handles operations related to degree relationships with faculties and courses.
 */
@Injectable()
export class DegreesRelationshipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseRelationshipService: DegreesCourseRelationshipService,
  ) {}

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

  async addCourse(degreeId: string, courseId: string): Promise<Degree> {
    return this.courseRelationshipService.addCourse(degreeId, courseId);
  }

  async removeCourse(degreeId: string, courseId: string): Promise<Degree> {
    return this.courseRelationshipService.removeCourse(degreeId, courseId);
  }

  async getCoursesByDegreeId(degreeId: string) {
    return this.courseRelationshipService.getCoursesByDegreeId(degreeId);
  }

}