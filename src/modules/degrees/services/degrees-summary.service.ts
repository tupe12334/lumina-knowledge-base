import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Service for generating degree summaries.
 * Handles summary generation operations for degrees.
 */
@Injectable()
export class DegreesSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a human-readable summary of a degree including its university, faculty, and courses.
   * @param id - The degree ID
   * @returns A plain text summary of the degree
   * @throws NotFoundException if the degree doesn't exist
   * @throws InternalServerErrorException if database operation fails
   */
  async generateSummary(id: string): Promise<string> {
    try {
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
            },
          },
          courses: {
            include: {
              name: true,
            },
          },
        },
      });

      if (!degree) {
        throw new NotFoundException(`Degree with ID ${id} not found`);
      }

      const degreeName =
        (degree.name && degree.name.en_text) || 'No English translation available';
      const universityName =
        (degree.institution && degree.institution.name && degree.institution.name.en_text) || 'No English translation available';
      const facultyName =
        (degree.faculty && degree.faculty.name && degree.faculty.name.en_text) || 'Not assigned to specific faculty';

      // Build associated courses
      const courseCount = degree.courses.length;
      const courseNames = degree.courses
        .map(
          (course) =>
            (course.name && course.name.en_text) || 'No English translation available',
        )
        .join(', ');

      const summary = `Degree: ${degreeName}
ID: ${degree.id}
Institution: ${universityName}
Faculty: ${facultyName}
Associated Courses: ${courseCount} courses - ${courseNames || 'None'}`;

      return summary;
    } catch (error: unknown) {
      if (error instanceof NotFoundException && error instanceof Error) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Failed to generate degree summary: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}