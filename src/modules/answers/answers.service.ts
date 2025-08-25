import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnswerInput } from './dto/create-answer.input';
import { CreateManyAnswersInput } from './dto/create-many-answers.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { AnswersQueryDto } from './dto/answers-query.dto';

@Injectable()
export class AnswersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: AnswersQueryDto) {
    return this.prisma.answer.findMany({
      where: { ...(query?.questionId ? { questionId: query.questionId } : {}) },
      include: {
        SelectAnswer: { include: { text: true } },
        UnitAnswer: true,
        NumberAnswer: true,
      },
    });
  }

  async findUnique(id: string) {
    return this.prisma.answer.findUnique({
      where: { id },
      include: {
        SelectAnswer: { include: { text: true } },
        UnitAnswer: true,
        NumberAnswer: true,
      },
    });
  }

  async create(data: CreateAnswerInput) {
    const { questionId, selectAnswers, unitValue, unit, numberAnswer } = data;

    // Ensure question exists
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

  /**
   * Creates multiple answers in a single transaction.
   * @param input - The data for creating multiple answers
   * @returns The number of answers created
   */
  async createMany(input: CreateManyAnswersInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const answerData of input.answers) {
        const { questionId, selectAnswers, unitValue, unit, numberAnswer } =
          answerData;

        // Ensure question exists
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
    const { id, questionId, selectAnswers, unitValue, unit, numberAnswer } =
      data;

    const exists = await this.prisma.answer.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Answer with ID ${id} not found`);

    // Optionally reassign to different question
    if (questionId) {
      const q = await this.prisma.question.findUnique({
        where: { id: questionId },
      });
      if (!q)
        throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    // Handle select answers: upsert by id when provided, otherwise create; delete removed ones
    if (selectAnswers) {
      const current = await this.prisma.selectAnswer.findMany({
        where: { answerId: id },
      });
      const byId = new Map(current.map((c) => [c.id, c] as const));
      const incomingIds = new Set<string>();

      for (const s of selectAnswers) {
        if (s.id && byId.has(s.id)) {
          incomingIds.add(s.id);
          await this.prisma.selectAnswer.update({
            where: { id: s.id },
            data: {
              ...(s.isCorrect != null ? { isCorrect: s.isCorrect } : {}),
              ...(s.translationId
                ? { text: { connect: { id: s.translationId } } }
                : {}),
            },
          });
        } else {
          await this.prisma.selectAnswer.create({
            data: {
              isCorrect:
                s.isCorrect !== null && s.isCorrect !== undefined
                  ? s.isCorrect
                  : false,
              text: { connect: { id: s.translationId! } },
              answer: { connect: { id } },
            },
          });
        }
      }

      // delete removed
      const toDelete = current.filter((c) => !incomingIds.has(c.id));
      if (toDelete.length) {
        await this.prisma.selectAnswer.deleteMany({
          where: { id: { in: toDelete.map((t) => t.id) } },
        });
      }
    }

    // Handle Unit/Number mutually exclusive updates
    if (unitValue != null || unit != null) {
      // if either provided, ensure we end with a unit answer and remove number answer
      await this.prisma.numberAnswer.deleteMany({ where: { answerId: id } });
      const existingUnit = await this.prisma.unitAnswer.findUnique({
        where: { answerId: id },
      });
      if (existingUnit) {
        await this.prisma.unitAnswer.update({
          where: { answerId: id },
          data: {
            ...(unitValue != null ? { value: unitValue } : {}),
            ...(unit != null ? { unit } : {}),
          },
        });
      } else if (unitValue != null && unit != null) {
        await this.prisma.unitAnswer.create({
          data: { value: unitValue, unit, answerId: id },
        });
      }
    }

    if (numberAnswer != null) {
      // ensure numeric answer and remove unit answer
      await this.prisma.unitAnswer.deleteMany({ where: { answerId: id } });
      const existingNumber = await this.prisma.numberAnswer.findUnique({
        where: { answerId: id },
      });
      if (existingNumber) {
        await this.prisma.numberAnswer.update({
          where: { answerId: id },
          data: { value: numberAnswer },
        });
      } else {
        await this.prisma.numberAnswer.create({
          data: { value: numberAnswer, answerId: id },
        });
      }
    }

    // Update relation to question if requested
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

  async remove(id: string) {
    const exists = await this.prisma.answer.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Answer with ID ${id} not found`);

    await this.prisma.selectAnswer.deleteMany({ where: { answerId: id } });
    await this.prisma.unitAnswer.deleteMany({ where: { answerId: id } });
    await this.prisma.numberAnswer.deleteMany({ where: { answerId: id } });

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
