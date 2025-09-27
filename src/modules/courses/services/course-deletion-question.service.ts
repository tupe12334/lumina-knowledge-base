import { Injectable } from '@nestjs/common';

interface DeletionCounters {
  deletedRelationships: number;
  orphanedModules: number;
  orphanedQuestions: number;
}

@Injectable()
export class CourseDeletionQuestionService {
  async deleteModuleQuestions(tx: unknown, module: unknown, counters: DeletionCounters) {
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
}