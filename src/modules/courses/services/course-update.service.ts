import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateCourseInput } from '../dto/update-course.input';
import { CourseIncludesService } from './course-includes.service';

type CourseWithDetails = Prisma.CourseGetPayload<{
  include: ReturnType<CourseIncludesService['getCourseDetailsInclude']>;
}>;

@Injectable()
export class CourseUpdateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly includes: CourseIncludesService,
  ) {}

  async updateCourse(input: UpdateCourseInput) {
    const { courseId, enText, heText, universityId, publishedAt } = input;

    if (
      typeof enText !== 'string' &&
      typeof heText !== 'string' &&
      typeof universityId !== 'string' &&
      publishedAt == null
    ) {
      throw new BadRequestException('No fields provided to update');
    }

    const course = await this.findCourseForUpdate(courseId);
    await this.performUpdatesInTransaction(courseId, course.translationId, input);
    return this.findUpdatedCourse(courseId);
  }

  private async findCourseForUpdate(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { name: true },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return course;
  }

  private async performUpdatesInTransaction(
    courseId: string,
    translationId: string,
    input: UpdateCourseInput,
  ) {
    const { enText, heText, universityId, publishedAt } = input;

    await this.prisma.$transaction(async (tx) => {
      if (typeof enText === 'string' || typeof heText === 'string') {
        await tx.translation.update({
          where: { id: translationId },
          data: {
            ...(typeof enText === 'string' ? { en_text: enText } : {}),
            ...(typeof heText === 'string' ? { he_text: heText } : {}),
          },
        });
      }

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
  }

  private async findUpdatedCourse(courseId: string): Promise<CourseWithDetails> {
    const updated = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: this.includes.getCourseDetailsInclude(),
    });

    if (!updated) {
      throw new NotFoundException(
        `Course with ID ${courseId} not found after update`,
      );
    }

    return updated;
  }

}