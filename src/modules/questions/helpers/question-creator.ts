import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCompleteQuestionsInput } from '../dto/create-complete-questions.input';

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

  private async createSingleCompleteQuestion(prisma: any, questionData: any) {
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
      throw new Error('validationStatus is required for question creation');
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
          connect: moduleIds ? moduleIds.map((id: string) => ({ id })) : undefined,
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

  private async createAnswersForQuestion(prisma: any, questionId: string, answerData: any) {
    const { type, selectAnswers, numberAnswer, booleanAnswer, unitValue, unit } = answerData;

    if (type === 'selection' && selectAnswers && selectAnswers.length > 0) {
      await this.createSelectAnswers(prisma, questionId, selectAnswers);
    } else if (type === 'boolean' && booleanAnswer !== undefined) {
      await this.createBooleanAnswer(prisma, questionId, booleanAnswer);
    } else if (type === 'value') {
      await this.createValueAnswer(prisma, questionId, unitValue, unit, numberAnswer);
    }
  }

  private async createSelectAnswers(prisma: any, questionId: string, selectAnswers: any[]) {
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
            const translation = answerTranslations[index];
            if (!translation) {
              throw new Error(`Missing translation for answer at index ${index}`);
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

  private async createBooleanAnswer(prisma: any, questionId: string, booleanAnswer: boolean) {
    await prisma.answer.create({
      data: {
        question: { connect: { id: questionId } },
        NumberAnswer: {
          create: { value: booleanAnswer },
        },
      },
    });
  }

  private async createValueAnswer(
    prisma: any,
    questionId: string,
    unitValue?: number,
    unit?: string,
    numberAnswer?: number
  ) {
    const answerData: Prisma.AnswerCreateInput = {
      question: { connect: { id: questionId } },
    };

    if (unitValue !== undefined && unit) {
      answerData.UnitAnswer = {
        create: { value: unitValue, unit },
      };
    } else if (numberAnswer !== undefined) {
      answerData.NumberAnswer = {
        create: { value: numberAnswer },
      };
    }

    await prisma.answer.create({ data: answerData });
  }
}