import { Injectable } from '@nestjs/common';
import { CourseDeletionRelationshipService } from './course-deletion-relationship.service';

interface DeletionCounters {
  deletedRelationships: number;
  orphanedModules: number;
  orphanedQuestions: number;
}

@Injectable()
export class CourseDeletionModuleService {
  constructor(
    private readonly relationshipService: CourseDeletionRelationshipService,
  ) {}

  async handleCourseModules(tx: unknown, course: unknown, courseId: string, counters: DeletionCounters) {
    const typedCourse = course as {
      modules: Array<{
        id: string;
        Course: Array<{ id: string }>;
      }>;
    };

    for (const module of typedCourse.modules) {
      const otherCourseModules = module.Course.filter(
        (c) => c.id !== courseId,
      );

      if (otherCourseModules.length === 0) {
        await this.deleteOrphanedModule(tx, module, counters);
      } else {
        await this.disconnectModuleFromCourse(tx, courseId, module.id);
      }
    }
  }

  private async deleteOrphanedModule(tx: unknown, module: unknown, counters: DeletionCounters) {
    counters.orphanedModules++;

    await this.deleteModuleQuestions(tx, module, counters);
    await this.relationshipService.deleteModuleRelationships(tx, module);
    await this.deleteModuleAndBlock(tx, module);
    await this.deleteModuleTranslationIfUnused(tx, module);
  }

  private async deleteModuleQuestions(tx: unknown, module: unknown, counters: DeletionCounters) {
    const typedModule = module as {
      Questions: Array<{
        id: string;
        Answer: Array<{ id: string }>;
      }>;
    };

    const typedTx = tx as {
      questionPart: {
        deleteMany: (args: unknown) => Promise<unknown>;
      };
      question: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
    };

    for (const question of typedModule.Questions) {
      await typedTx.questionPart.deleteMany({
        where: {
          OR: [
            { questionId: question.id },
            { partQuestionId: question.id },
          ],
        },
      });

      await this.deleteQuestionAnswers(tx, question);
      await typedTx.question.delete({
        where: { id: question.id },
      });
      counters.orphanedQuestions++;
    }
  }

  private async deleteQuestionAnswers(tx: unknown, question: unknown) {
    const typedQuestion = question as {
      Answer: Array<{ id: string }>;
    };

    const typedTx = tx as {
      selectAnswer: {
        deleteMany: (args: { where: { answerId: string } }) => Promise<unknown>;
      };
      unitAnswer: {
        deleteMany: (args: { where: { answerId: string } }) => Promise<unknown>;
      };
      numberAnswer: {
        deleteMany: (args: { where: { answerId: string } }) => Promise<unknown>;
      };
      answer: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
    };

    for (const answer of typedQuestion.Answer) {
      await typedTx.selectAnswer.deleteMany({
        where: { answerId: answer.id },
      });
      await typedTx.unitAnswer.deleteMany({
        where: { answerId: answer.id },
      });
      await typedTx.numberAnswer.deleteMany({
        where: { answerId: answer.id },
      });
      await typedTx.answer.delete({
        where: { id: answer.id },
      });
    }
  }

  private async deleteModuleAndBlock(tx: unknown, module: unknown) {
    const typedModule = module as {
      id: string;
      Block: { id: string };
    };

    const typedTx = tx as {
      module: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
      block: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
    };

    await typedTx.module.delete({
      where: { id: typedModule.id },
    });
    await typedTx.block.delete({
      where: { id: typedModule.Block.id },
    });
  }

  private async deleteModuleTranslationIfUnused(tx: unknown, module: unknown) {
    const typedModule = module as {
      translationId: string;
    };

    const typedTx = tx as {
      module: {
        findFirst: (args: { where: { translationId: string } }) => Promise<unknown | null>;
      };
      translation: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
    };

    const translationUsage = await typedTx.module.findFirst({
      where: { translationId: typedModule.translationId },
    });
    if (!translationUsage) {
      await typedTx.translation.delete({
        where: { id: typedModule.translationId },
      });
    }
  }

  private async disconnectModuleFromCourse(tx: unknown, courseId: string, moduleId: string) {
    const typedTx = tx as {
      course: {
        update: (args: unknown) => Promise<unknown>;
      };
    };

    await typedTx.course.update({
      where: { id: courseId },
      data: {
        modules: {
          disconnect: { id: moduleId },
        },
      },
    });
  }
}