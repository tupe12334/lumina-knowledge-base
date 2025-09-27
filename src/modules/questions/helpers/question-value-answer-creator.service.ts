import { Injectable } from '@nestjs/common';
import { Prisma, Units } from '@prisma/client';

@Injectable()
export class QuestionValueAnswerCreatorService {
  async createBooleanAnswer(
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

  async createValueAnswer(
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