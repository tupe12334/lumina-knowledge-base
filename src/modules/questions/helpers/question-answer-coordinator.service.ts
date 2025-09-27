import { Injectable } from '@nestjs/common';
import { Prisma, Units } from '@prisma/client';
import { QuestionSelectAnswerCreatorService } from './question-select-answer-creator.service';
import { QuestionValueAnswerCreatorService } from './question-value-answer-creator.service';

@Injectable()
export class QuestionAnswerCoordinatorService {
  constructor(
    private readonly selectAnswerCreator: QuestionSelectAnswerCreatorService,
    private readonly valueAnswerCreator: QuestionValueAnswerCreatorService,
  ) {}

  async createAnswersForQuestion(
    prisma: Prisma.TransactionClient,
    questionId: string,
    answerData: {
      type: string;
      selectAnswers?: Array<{
        en_text: string;
        he_text: string;
        is_correct: boolean;
      }>;
      numberAnswer?: number;
      booleanAnswer?: number;
      unitValue?: number;
      unit?: Units;
    },
  ) {
    const {
      type,
      selectAnswers,
      numberAnswer,
      booleanAnswer,
      unitValue,
      unit,
    } = answerData;

    if (type === 'selection' && selectAnswers && selectAnswers.length > 0) {
      await this.selectAnswerCreator.createSelectAnswers(prisma, questionId, selectAnswers);
    } else if (type === 'boolean' && booleanAnswer !== undefined) {
      await this.valueAnswerCreator.createBooleanAnswer(prisma, questionId, booleanAnswer);
    } else if (type === 'value') {
      await this.valueAnswerCreator.createValueAnswer(
        prisma,
        questionId,
        unitValue,
        unit,
        numberAnswer,
      );
    }
  }
}