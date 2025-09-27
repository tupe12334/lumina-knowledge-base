import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class CourseSummaryService {
  constructor(private readonly prisma: PrismaService) {}

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

      const summaryData = this.extractCourseSummaryData(course);
      return this.buildCourseSummary(course, summaryData);
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
      include: {
        name: true,
        institution: {
          include: {
            name: true,
          },
        },
        Degree: {
          include: {
            name: true,
          },
        },
        modules: {
          include: {
            name: true,
          },
        },
        Block: {
          include: {
            prerequisiteFor: {
              include: {
                postrequisite: {
                  include: {
                    Course: {
                      include: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            postrequisiteOf: {
              include: {
                prerequisite: {
                  include: {
                    Course: {
                      include: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  private extractCourseSummaryData(course: any) {
    const courseName =
      (course.name && course.name.en_text) || 'No English translation available';
    const universityName =
      (course.institution && course.institution.name && course.institution.name.en_text) || 'No English translation available';

    // Build associated degrees
    const degreeNames = course.Degree.map(
      (degree: any) => (degree.name && degree.name.en_text) || 'No English translation available',
    ).join(', ');

    // Build modules information
    const moduleCount = course.modules.length;
    const moduleNames = course.modules
      .map(
        (module: any) =>
          (module.name && module.name.en_text) || 'No English translation available',
      )
      .join(', ');

    const prerequisites = this.extractPrerequisites(course);
    const postrequisites = this.extractPostrequisites(course);

    return {
      courseName,
      universityName,
      degreeNames,
      moduleCount,
      moduleNames,
      prerequisites,
      postrequisites,
    };
  }

  private extractPrerequisites(course: any): string {
    if (!course.Block || !course.Block.postrequisiteOf) {
      return 'None';
    }

    const prerequisites = course.Block.postrequisiteOf
      .flatMap(
        (rel: any) =>
          (rel.prerequisite.Course && rel.prerequisite.Course.map(
            (c: any) => (c.name && c.name.en_text) || 'No English translation available',
          )) || [],
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return prerequisites || 'None';
  }

  private extractPostrequisites(course: any): string {
    if (!course.Block || !course.Block.prerequisiteFor) {
      return 'None';
    }

    const postrequisites = course.Block.prerequisiteFor
      .flatMap(
        (rel: any) =>
          (rel.postrequisite.Course && rel.postrequisite.Course.map(
            (c: any) => (c.name && c.name.en_text) || 'No English translation available',
          )) || [],
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return postrequisites || 'None';
  }

  private buildCourseSummary(course: any, data: any): string {
    return `Course: ${data.courseName}
ID: ${course.id}
Institution: ${data.universityName}
Associated Degrees: ${data.degreeNames || 'None'}
Modules: ${data.moduleCount} modules - ${data.moduleNames || 'None'}
Prerequisites: ${data.prerequisites}
Postrequisites: ${data.postrequisites}`;
  }
}