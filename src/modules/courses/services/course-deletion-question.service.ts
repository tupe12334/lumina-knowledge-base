import { Injectable } from '@nestjs/common';
import { CourseDeletionTransaction } from '../types/course-deletion-transaction.type';
import { ModuleWithQuestions } from '../types/module-with-questions.type';
import { QuestionWithAnswers } from '../types/question-with-answers.type';

interface DeletionCounters {
  deletedRelationships: number;
  orphanedModules: number;
  orphanedQuestions: number;
}

@Injectable()
export class CourseDeletionQuestionService {
  async deleteModuleQuestions(tx: CourseDeletionTransaction, module: ModuleWithQuestions, counters: DeletionCounters) {
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

  private async deleteQuestionAnswers(tx: CourseDeletionTransaction, question: QuestionWithAnswers) {
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
}