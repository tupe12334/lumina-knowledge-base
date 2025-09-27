import { BadRequestException } from '@nestjs/common';
import { Prisma, PrismaClient, Units } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCompleteQuestionsInput } from '../dto/create-complete-questions.input';
import { CreateCompleteQuestionInput } from '../dto/create-complete-question.input';

export class QuestionCreator {
  constructor(private readonly prisma: PrismaService) {}

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
      en_text,
      he_text,
      type,
      moduleIds,
      validationStatus,
      selectAnswers,
      numberAnswer,
      booleanAnswer,
      unitValue,
      unit,
    } = questionData;

    if (!validationStatus) {
      throw new BadRequestException(
        'validationStatus is required for question creation',
      );
    }

    const translation = await prisma.translation.create({
      data: { en_text, he_text },
    });

    const question = await prisma.question.create({
      data: {
        type,
        validationStatus,
        text: { connect: { id: translation.id } },
        Modules: {
          connect: moduleIds
            ? moduleIds.map((id: string) => ({ id }))
            : undefined,
        },
      },
    });

    await this.createAnswersForQuestion(prisma, question.id, {
      type,
      selectAnswers,
      numberAnswer,
      booleanAnswer,
      unitValue,
      unit,
    });
  }

  private async createAnswersForQuestion(
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
      await this.createSelectAnswers(prisma, questionId, selectAnswers);
    } else if (type === 'boolean' && booleanAnswer !== undefined) {
      await this.createBooleanAnswer(prisma, questionId, booleanAnswer);
    } else if (type === 'value') {
      await this.createValueAnswer(
        prisma,
        questionId,
        unitValue,
        unit,
        numberAnswer,
      );
    }
  }

  private async createSelectAnswers(
    prisma: Prisma.TransactionClient,
    questionId: string,
    selectAnswers: Array<{
      en_text: string;
      he_text: string;
      is_correct: boolean;
    }>,
  ) {
    const answerTranslations = await Promise.all(
      selectAnswers.map((answer) =>
        prisma.translation.create({
          data: {
            en_text: answer.en_text,
            he_text: answer.he_text,
          },
        }),
      ),
    );

    await prisma.answer.create({
      data: {
        question: { connect: { id: questionId } },
        SelectAnswer: {
          create: selectAnswers.map((answer, index) => {
            if (index < 0 || index >= answerTranslations.length) {
              throw new BadRequestException(
                `Invalid index ${index} for answerTranslations array`,
              );
            }
            const translation = answerTranslations.at(index);
            if (!translation) {
              throw new BadRequestException(
                `Missing translation for answer at index ${index}`,
              );
            }
            return {
              isCorrect: answer.is_correct,
              text: { connect: { id: translation.id } },
            };
          }),
        },
      },
    });
  }

  private async createBooleanAnswer(
    prisma: Prisma.TransactionClient,
    questionId: string,
    booleanAnswer: number,
  ) {
    await prisma.answer.create({
      data: {
        question: { connect: { id: questionId } },
        BooleanAnswer: {
          create: { value: Boolean(booleanAnswer) },
        },
      },
    });
  }

  private async createValueAnswer(
    prisma: Prisma.TransactionClient,
    questionId: string,
    unitValue?: number,
    unit?: Units,
    numberAnswer?: number,
  ) {
    const answerData: Prisma.AnswerCreateInput = {
      question: { connect: { id: questionId } },
    };

    if (unitValue !== undefined && unit) {
      answerData.UnitAnswer = {
        create: { value: unitValue, unit: unit },
      };
    } else if (numberAnswer !== undefined) {
      answerData.NumberAnswer = {
        create: { value: numberAnswer },
      };
    }

    await prisma.answer.create({ data: answerData });
  }
}
