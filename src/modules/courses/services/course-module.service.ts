import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Course } from '../models/Course.entity';
import { SetCourseModulesInput } from '../dto/set-course-modules.input';

@Injectable()
export class CourseModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async setCourseModules(input: SetCourseModulesInput): Promise<Course> {
    const { courseId, moduleIds } = input;

    const course = await this.findCourseForModuleUpdate(courseId);
    await this.validateModulesExist(moduleIds);
    await this.updateCourseModules(courseId, moduleIds);

    return this.findUpdatedCourseWithModules(courseId);
  }

  private async findCourseForModuleUpdate(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { name: true },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return course;
  }

  private async validateModulesExist(moduleIds: string[]) {
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
  }

  private async updateCourseModules(courseId: string, moduleIds: string[]) {
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        modules: {
          set: moduleIds.map((id) => ({ id })),
        },
      },
    });
  }

  private async findUpdatedCourseWithModules(courseId: string): Promise<Course> {
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