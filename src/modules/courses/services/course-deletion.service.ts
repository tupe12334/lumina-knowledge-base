import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { DeleteCourseInput } from '../dto/delete-course.input';
import { DeleteCourseResult } from '../dto/delete-course-result.type';
import { CourseDeletionQueryService } from './course-deletion-query.service';
import { CourseDeletionRelationshipService } from './course-deletion-relationship.service';
import { CourseDeletionModuleService } from './course-deletion-module.service';

type TransactionClient = Prisma.TransactionClient;
interface CourseWithBlock {
  id: string;
  translationId: string;
  Block: { id: string };
  name: { en_text: string; he_text: string };
}

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

      const courseName = course.name.en_text || course.name.he_text || 'Unknown Course';

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


  private async deleteCourseAndBlock(tx: TransactionClient, course: CourseWithBlock, courseId: string) {


    await tx.course.delete({
      where: { id: courseId },
    });
    await tx.block.delete({
      where: { id: course.Block.id },
    });

    const translationUsage = await tx.course.findFirst({
      where: { translationId: course.translationId },
    });
    if (!translationUsage) {
      await tx.translation.delete({
        where: { id: course.translationId },
      });
    }
  }
}