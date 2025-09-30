import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CourseWithModules } from '../types/course-with-modules.type';

@Injectable()
export class CourseDeletionQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findCourseWithAllRelatedData(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        name: true,
        Block: {
          include: {
            prerequisiteFor: {
              include: {
                metadata: true,
              },
            },
            postrequisiteOf: {
              include: {
                metadata: true,
              },
            },
          },
        },
        modules: {
          include: {
            Questions: {
              include: {
                Answer: {
                  include: {
                    SelectAnswer: true,
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
                Parts: true,
                PartOf: true,
              },
            },
            name: true,
            Block: {
              include: {
                prerequisiteFor: {
                  include: {
                    metadata: true,
                  },
                },
                postrequisiteOf: {
                  include: {
                    metadata: true,
                  },
                },
              },
            },
            Course: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return course;
  }

  validateCourseDeletion(course: CourseWithModules, force: boolean) {
    if (!force) {
      const hasRelationships =
        course.Block.prerequisiteFor.length > 0 ||
        course.Block.postrequisiteOf.length > 0;
      const hasModulesWithQuestions = course.modules.some(
        (module) => module.Questions.length > 0,
      );

      if (hasRelationships || hasModulesWithQuestions) {
        throw new BadRequestException(
          'Cannot delete course with existing relationships or questions. Use force=true to override.',
        );
      }
    }
  }
}