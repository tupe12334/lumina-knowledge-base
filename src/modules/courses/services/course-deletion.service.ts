import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DeleteCourseInput } from '../dto/delete-course.input';
import { DeleteCourseResult } from '../dto/delete-course-result.type';
import { CourseDeletionQueryService } from './course-deletion-query.service';
import { CourseDeletionRelationshipService } from './course-deletion-relationship.service';
import { CourseDeletionModuleService } from './course-deletion-module.service';

@Injectable()
export class CourseDeletionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryService: CourseDeletionQueryService,
    private readonly relationshipService: CourseDeletionRelationshipService,
    private readonly moduleService: CourseDeletionModuleService,
  ) {}

  async deleteCourse(
    deleteData: DeleteCourseInput,
  ): Promise<DeleteCourseResult> {
    const { courseId, force = true } = deleteData;

    const course = await this.queryService.findCourseWithAllRelatedData(courseId);
    this.queryService.validateCourseDeletion(course, force);

    const result = await this.prisma.$transaction(async (tx) => {
      const counters = { deletedRelationships: 0, orphanedModules: 0, orphanedQuestions: 0 };

      await this.relationshipService.deleteCourseRelationships(tx, course, counters);
      await this.moduleService.handleCourseModules(tx, course, courseId, counters);
      await this.deleteCourseAndBlock(tx, course, courseId);

      const typedCourse = course as {
        name: { en_text?: string; he_text?: string };
      };

      const courseName = typedCourse.name.en_text || typedCourse.name.he_text || 'Unknown Course';

      return {
        courseId,
        courseName,
        ...counters,
        success: true,
        message: `Successfully deleted course "${courseName}" and cleaned up ${counters.orphanedModules} modules, ${counters.orphanedQuestions} questions, ${counters.deletedRelationships} relationships.`,
      };
    });

    return result;
  }


  private async deleteCourseAndBlock(tx: unknown, course: unknown, courseId: string) {
    const typedTx = tx as {
      course: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
        findFirst: (args: { where: { translationId: string } }) => Promise<unknown | null>;
      };
      block: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
      translation: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
    };

    const typedCourse = course as {
      Block: { id: string };
      translationId: string;
    };

    await typedTx.course.delete({
      where: { id: courseId },
    });
    await typedTx.block.delete({
      where: { id: typedCourse.Block.id },
    });

    const translationUsage = await typedTx.course.findFirst({
      where: { translationId: typedCourse.translationId },
    });
    if (!translationUsage) {
      await typedTx.translation.delete({
        where: { id: typedCourse.translationId },
      });
    }
  }
}