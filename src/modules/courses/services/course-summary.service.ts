import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CourseIncludesService } from './course-includes.service';
import { CourseTextFormatterService } from './course-text-formatter.service';

@Injectable()
export class CourseSummaryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly includesService: CourseIncludesService,
    private readonly formatterService: CourseTextFormatterService,
  ) {}

  /**
   * Generates a human-readable summary of a course including its university, degrees, modules, and prerequisites.
   * @param id - The course ID
   * @returns A plain text summary of the course
   * @throws NotFoundException if the course doesn't exist
   * @throws InternalServerErrorException if database operation fails
   */
  async generateSummary(id: string): Promise<string> {
    try {
      const course = await this.findCourseForSummary(id);

      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      const summaryData = this.formatterService.extractCourseSummaryData(course);
      return this.formatterService.buildCourseSummary(course, summaryData);
    } catch (error: unknown) {
      if (error instanceof NotFoundException && error instanceof Error) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Failed to generate course summary: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async findCourseForSummary(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: this.includesService.getSummaryInclude(),
    });
  }
}