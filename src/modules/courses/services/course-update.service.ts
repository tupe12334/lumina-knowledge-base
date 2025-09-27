import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Course } from '../models/Course.entity';
import { UpdateCourseInput } from '../dto/update-course.input';
import { SetCourseModulesInput } from '../dto/set-course-modules.input';

@Injectable()
export class CourseUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generic course update supporting translation and optional fields.
   * If no updatable fields are provided, throws BadRequest.
   */
  async updateCourse(input: UpdateCourseInput): Promise<Course> {
    const { courseId, enText, heText, universityId, publishedAt } = input;

    if (
      typeof enText !== 'string' &&
      typeof heText !== 'string' &&
      typeof universityId !== 'string' &&
      publishedAt == null
    ) {
      throw new BadRequestException('No fields provided to update');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        name: true,
        institution: { include: { name: true } },
        Block: true,
        modules: {
          include: {
            name: true,
            Block: true,
            subModules: true,
            parentModules: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Perform updates in a transaction when multiple entities are involved
    await this.prisma.$transaction(async (tx) => {
      // Update translation if relevant
      if (typeof enText === 'string' || typeof heText === 'string') {
        await tx.translation.update({
          where: { id: course.translationId },
          data: {
            ...(typeof enText === 'string' ? { en_text: enText } : {}),
            ...(typeof heText === 'string' ? { he_text: heText } : {}),
          },
        });
      }

      // Update course fields
      if (typeof universityId === 'string' || publishedAt !== undefined) {
        await tx.course.update({
          where: { id: courseId },
          data: {
            ...(typeof universityId === 'string' ? { institutionId: universityId } : {}),
            ...(publishedAt !== undefined ? { publishedAt } : {}),
          },
        });
      }
    });

    // Return fresh course with updated data
    const updated = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        institution: { include: { name: true } },
        name: true,
        Block: {
          include: {
            postrequisiteOf: true,
            prerequisiteFor: true,
          },
        },
        modules: {
          include: {
            name: true,
            Block: {
              include: {
                postrequisiteOf: true,
                prerequisiteFor: true,
              },
            },
            subModules: {
              include: {
                name: true,
              },
            },
            parentModules: {
              include: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!updated) {
      throw new NotFoundException(
        `Course with ID ${courseId} not found after update`,
      );
    }

    return updated;
  }

  /**
   * Sets the modules of a course, replacing any existing assignments.
   */
  async setCourseModules(input: SetCourseModulesInput): Promise<Course> {
    const { courseId, moduleIds } = input;

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { name: true },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Optional validation: ensure all modules exist
    const existingModules = await this.prisma.module.findMany({
      where: { id: { in: moduleIds } },
      select: { id: true },
    });
    const existingIds = new Set(existingModules.map((m) => m.id));
    const missing = moduleIds.filter((id) => !existingIds.has(id));
    if (missing.length > 0) {
      throw new BadRequestException(
        `Some modules do not exist: ${missing.join(', ')}`,
      );
    }

    // Update relation using set to replace existing associations
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        modules: {
          set: moduleIds.map((id) => ({ id })),
        },
      },
    });

    // Return fresh course with relations
    const updated = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        institution: { include: { name: true } },
        name: true,
        Block: {
          include: {
            postrequisiteOf: true,
            prerequisiteFor: true,
          },
        },
        modules: {
          include: {
            name: true,
            Block: {
              include: {
                postrequisiteOf: true,
                prerequisiteFor: true,
              },
            },
            subModules: {
              include: { name: true },
            },
            parentModules: {
              include: { name: true },
            },
          },
        },
      },
    });

    if (!updated) {
      throw new NotFoundException(
        `Course with ID ${courseId} not found after updating modules`,
      );
    }

    return updated;
  }
}