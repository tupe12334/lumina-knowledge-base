import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DeleteCourseInput } from '../dto/delete-course.input';
import { DeleteCourseResult } from '../dto/delete-course-result.type';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class CourseDeletionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Deletes a course and cleans up all related data from the database.
   * This includes:
   * - Course relationships (prerequisites/postrequisites)
   * - Module relationships
   * - Questions associated with course modules
   * - Translation data
   * @param deleteData - The course deletion data containing course ID
   * @returns The deletion result with cleanup details
   */
  async deleteCourse(
    deleteData: DeleteCourseInput,
  ): Promise<DeleteCourseResult> {
    const { courseId, force = true } = deleteData;

    const course = await this.findCourseWithAllRelatedData(courseId);
    this.validateCourseDeletion(course, force);

    const result = await this.prisma.$transaction(async (tx) => {
      const counters = { deletedRelationships: 0, orphanedModules: 0, orphanedQuestions: 0 };

      await this.deleteCourseRelationships(tx, course, counters);
      await this.handleCourseModules(tx, course, courseId, counters);
      await this.deleteCourseAndBlock(tx, course, courseId);

      return {
        courseId,
        courseName: course.name.en_text || course.name.he_text,
        ...counters,
        success: true,
        message: `Successfully deleted course "${course.name.en_text || course.name.he_text}" and cleaned up ${counters.orphanedModules} modules, ${counters.orphanedQuestions} questions, ${counters.deletedRelationships} relationships.`,
      };
    });

    return result;
  }

  private async findCourseWithAllRelatedData(courseId: string) {
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

  private validateCourseDeletion(course: any, force: boolean) {
    if (!force) {
      const hasRelationships =
        course.Block.prerequisiteFor.length > 0 ||
        course.Block.postrequisiteOf.length > 0;
      const hasModulesWithQuestions = course.modules.some(
        (module: any) => module.Questions.length > 0,
      );

      if (hasRelationships || hasModulesWithQuestions) {
        throw new BadRequestException(
          'Cannot delete course with existing relationships or questions. Use force=true to override.',
        );
      }
    }
  }

  private async deleteCourseRelationships(tx: any, course: any, counters: any) {
    const courseRelationships = await tx.blockRelationship.findMany({
      where: {
        OR: [
          { prerequisiteId: course.Block.id },
          { postrequisiteId: course.Block.id },
        ],
      },
      include: {
        metadata: true,
      },
    });

    for (const relationship of courseRelationships) {
      await tx.relationshipMetadata.deleteMany({
        where: { blockRelationshipId: relationship.id },
      });
      await tx.blockRelationship.delete({
        where: { id: relationship.id },
      });
      counters.deletedRelationships++;
    }
  }

  private async handleCourseModules(tx: any, course: any, courseId: string, counters: any) {
    for (const module of course.modules) {
      const otherCourseModules = module.Course.filter(
        (c: any) => c.id !== courseId,
      );

      if (otherCourseModules.length === 0) {
        await this.deleteOrphanedModule(tx, module, counters);
      } else {
        await this.disconnectModuleFromCourse(tx, courseId, module.id);
      }
    }
  }

  private async deleteOrphanedModule(tx: any, module: any, counters: any) {
    counters.orphanedModules++;

    await this.deleteModuleQuestions(tx, module, counters);
    await this.deleteModuleRelationships(tx, module);
    await this.deleteModuleAndBlock(tx, module);
    await this.deleteModuleTranslationIfUnused(tx, module);
  }

  private async deleteModuleQuestions(tx: any, module: any, counters: any) {
    for (const question of module.Questions) {
      await tx.questionPart.deleteMany({
        where: {
          OR: [
            { questionId: question.id },
            { partQuestionId: question.id },
          ],
        },
      });

      await this.deleteQuestionAnswers(tx, question);
      await tx.question.delete({
        where: { id: question.id },
      });
      counters.orphanedQuestions++;
    }
  }

  private async deleteQuestionAnswers(tx: any, question: any) {
    for (const answer of question.Answer) {
      await tx.selectAnswer.deleteMany({
        where: { answerId: answer.id },
      });
      await tx.unitAnswer.deleteMany({
        where: { answerId: answer.id },
      });
      await tx.numberAnswer.deleteMany({
        where: { answerId: answer.id },
      });
      await tx.answer.delete({
        where: { id: answer.id },
      });
    }
  }

  private async deleteModuleRelationships(tx: any, module: any) {
    const moduleRelationships = await tx.blockRelationship.findMany({
      where: {
        OR: [
          { prerequisiteId: module.Block.id },
          { postrequisiteId: module.Block.id },
        ],
      },
      include: {
        metadata: true,
      },
    });

    for (const relationship of moduleRelationships) {
      await tx.relationshipMetadata.deleteMany({
        where: { blockRelationshipId: relationship.id },
      });
      await tx.blockRelationship.delete({
        where: { id: relationship.id },
      });
    }
  }

  private async deleteModuleAndBlock(tx: any, module: any) {
    await tx.module.delete({
      where: { id: module.id },
    });
    await tx.block.delete({
      where: { id: module.Block.id },
    });
  }

  private async deleteModuleTranslationIfUnused(tx: any, module: any) {
    const translationUsage = await tx.module.findFirst({
      where: { translationId: module.translationId },
    });
    if (!translationUsage) {
      await tx.translation.delete({
        where: { id: module.translationId },
      });
    }
  }

  private async disconnectModuleFromCourse(tx: any, courseId: string, moduleId: string) {
    await tx.course.update({
      where: { id: courseId },
      data: {
        modules: {
          disconnect: { id: moduleId },
        },
      },
    });
  }

  private async deleteCourseAndBlock(tx: any, course: any, courseId: string) {
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