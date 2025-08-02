import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Question } from './models/Question.entity';
import { QuestionsQueryDto } from './dto/questions-query.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: QuestionsQueryDto): Promise<Question[]> {
    // Build where clause based on filters
    const where: any = {};

    // Handle both array and single module filtering
    const moduleIds = filters?.moduleIds || (filters?.moduleId ? [filters.moduleId] : []);
    if (moduleIds.length > 0) {
      where.Modules = { some: { id: { in: moduleIds } } };
    }

    // Handle both array and single course filtering
    const courseIds = filters?.courseIds || (filters?.courseId ? [filters.courseId] : []);
    if (courseIds.length > 0) {
      where.Modules = {
        some: {
          Course: {
            some: { id: { in: courseIds } },
          },
        },
      };
    }

    // Handle both array and single question type filtering
    const questionTypes = filters?.questionTypes || (filters?.questionType ? [filters.questionType] : []);
    if (questionTypes.length > 0) {
      where.type = { in: questionTypes };
    }

    // If excludePartQuestions is true, exclude questions that are part of other questions
    if (filters?.excludePartQuestions) {
      const partQuestionIds = await this.prisma.questionPart.findMany({
        select: { partQuestionId: true, questionId: true },
        distinct: ['partQuestionId'],
      });

      // Only exclude questions that are parts of OTHER questions (not themselves)
      const idsToExclude = partQuestionIds
        .filter((part) => part.partQuestionId !== part.questionId)
        .map((part) => part.partQuestionId);

      if (idsToExclude.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        where.id = { notIn: idsToExclude };
      }
    }

    const questions = await this.prisma.question.findMany({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: {
          include: {
            SelectAnswer: { include: { text: true } },
            UnitAnswer: true,
            NumberAnswer: true,
          },
        },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return questions.map(({ Answer, Modules, Parts, ...question }) => ({
      ...question,
      modules: Modules,
      answers: Answer,
      parts: Parts,
    }));
  }

  async findUnique(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: {
          include: {
            SelectAnswer: { include: { text: true } },
            UnitAnswer: true,
            NumberAnswer: true,
          },
        },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!question) {
      return null;
    }

    const { Answer, Modules, Parts, ...rest } = question;

    return { ...rest, modules: Modules, answers: Answer, parts: Parts };
  }
}
