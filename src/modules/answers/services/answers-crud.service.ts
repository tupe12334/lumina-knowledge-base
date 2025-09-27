import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAnswerInput } from '../dto/create-answer.input';
import { CreateManyAnswersInput } from '../dto/create-many-answers.input';
import { UpdateAnswerInput } from '../dto/update-answer.input';
import { AnswersUpdateService } from './answers-update.service';

@Injectable()
export class AnswersCrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly updateService: AnswersUpdateService,
  ) {}

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

  async update(data: UpdateAnswerInput) {
    const { id, questionId, selectAnswers, unitValue, unit, numberAnswer } = data;

    const exists = await this.prisma.answer.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Answer with ID ${id} not found`);

    if (questionId) {
      await this.updateService.validateQuestionExists(questionId);
    }

    if (selectAnswers) {
      await this.updateService.updateSelectAnswers(id, selectAnswers);
    }

    if (unitValue != null || unit != null) {
      await this.updateService.updateUnitAnswer(id, unitValue, unit);
    } else if (numberAnswer != null) {
      await this.updateService.updateNumberAnswer(id, numberAnswer);
    }

    const updated = await this.prisma.answer.update({
      where: { id },
      data: {
        ...(questionId ? { question: { connect: { id: questionId } } } : {}),
      },
      include: {
        SelectAnswer: { include: { text: true } },
        UnitAnswer: true,
        NumberAnswer: true,
      },
    });

    return updated;
  }

  async delete(id: string) {
    return this.prisma.answer.delete({
      where: { id },
      include: {
        SelectAnswer: { include: { text: true } },
        UnitAnswer: true,
        NumberAnswer: true,
      },
    });
  }
}