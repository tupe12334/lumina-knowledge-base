import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCompleteQuestionsInput } from '../dto/create-complete-questions.input';
import { CreateCompleteQuestionInput } from '../dto/create-complete-question.input';
import { QuestionEntityCreatorService } from './question-entity-creator.service';
import { QuestionAnswerCoordinatorService } from './question-answer-coordinator.service';

@Injectable()
export class QuestionCreator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entityCreator: QuestionEntityCreatorService,
    private readonly answerCoordinator: QuestionAnswerCoordinatorService,
  ) {}

  async createCompleteMany(input: CreateCompleteQuestionsInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const questionData of input.questions) {
        await this.createSingleCompleteQuestion(prisma, questionData);
        createdCount++;
      }

      return { count: createdCount };
    });
  }

  private async createSingleCompleteQuestion(
    prisma: Prisma.TransactionClient,
    questionData: CreateCompleteQuestionInput,
  ) {
    const {
      type,
      selectAnswers,
      numberAnswer,
      booleanAnswer,
      unitValue,
      unit,
    } = questionData;

    const question = await this.entityCreator.createQuestionWithTranslation(prisma, questionData);

    await this.answerCoordinator.createAnswersForQuestion(prisma, question.id, {
      type,
      selectAnswers,
      numberAnswer,
      booleanAnswer,
      unitValue,
      unit,
    });
  }

}
