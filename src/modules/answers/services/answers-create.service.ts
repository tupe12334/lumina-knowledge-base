import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAnswerInput } from '../dto/create-answer.input';
import { CreateManyAnswersInput } from '../dto/create-many-answers.input';

@Injectable()
export class AnswersCreateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAnswerInput) {
    const { questionId, selectAnswers, unitValue, unit, numberAnswer } = data;

    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question)
      throw new NotFoundException(`Question with ID ${questionId} not found`);

    const created = await this.prisma.answer.create({
      data: {
        question: { connect: { id: questionId } },
        SelectAnswer:
          selectAnswers && selectAnswers.length > 0
            ? {
                create: selectAnswers.map((s) => ({
                  isCorrect: s.isCorrect,
                  text: { connect: { id: s.translationId } },
                })),
              }
            : undefined,
        UnitAnswer:
          unitValue != null && unit != null
            ? {
                create: { value: unitValue, unit },
              }
            : undefined,
        NumberAnswer:
          numberAnswer != null
            ? {
                create: { value: numberAnswer },
              }
            : undefined,
      },
      include: {
        SelectAnswer: { include: { text: true } },
        UnitAnswer: true,
        NumberAnswer: true,
      },
    });

    return created;
  }

  async createMany(data: CreateManyAnswersInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const {
        questionId,
        selectAnswers,
        unitValue,
        unit,
        numberAnswer,
      } of data.answers) {
        const question = await prisma.question.findUnique({
          where: { id: questionId },
        });

        if (!question) {
          throw new NotFoundException(
            `Question with ID ${questionId} not found`,
          );
        }

        await prisma.answer.create({
          data: {
            question: { connect: { id: questionId } },
            SelectAnswer:
              selectAnswers && selectAnswers.length > 0
                ? {
                    create: selectAnswers.map((s) => ({
                      isCorrect: s.isCorrect,
                      text: { connect: { id: s.translationId } },
                    })),
                  }
                : undefined,
            UnitAnswer:
              unitValue != null && unit != null
                ? {
                    create: { value: unitValue, unit },
                  }
                : undefined,
            NumberAnswer:
              numberAnswer != null
                ? {
                    create: { value: numberAnswer },
                  }
                : undefined,
          },
        });
        createdCount++;
      }

      return { count: createdCount };
    });
  }
}