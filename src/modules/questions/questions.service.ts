import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Question } from './models/Question.entity';
import { QuestionsQueryInput } from './dto/questions-query.input';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: QuestionsQueryInput): Promise<Question[]> {
    // Build where clause based on filters
    const where: Record<string, any> = {};

    // Handle both array and single module filtering
    const moduleIds =
      filters?.moduleIds || (filters?.moduleId ? [filters.moduleId] : []);

    // Handle both array and single course filtering
    const courseIds =
      filters?.courseIds || (filters?.courseId ? [filters.courseId] : []);

    // Debug: log the filters and where clause
    console.log('🔍 Service filters:', JSON.stringify(filters, null, 2));
    console.log('🔍 Service moduleIds:', moduleIds);

    // Build Module filter combining both module and course filters
    if (moduleIds.length > 0 || courseIds.length > 0) {
      const moduleConditions: any[] = [];

      if (moduleIds.length > 0) {
        moduleConditions.push({ id: { in: moduleIds } });
      }

      if (courseIds.length > 0) {
        moduleConditions.push({
          Course: {
            some: { id: { in: courseIds } },
          },
        });
      }

      where.Modules = {
        some: {
          AND: moduleConditions,
        },
      };
    }

    // Handle both array and single question type filtering
    const questionTypes =
      filters?.questionTypes ||
      (filters?.questionType ? [filters.questionType] : []);
    if (questionTypes.length > 0) {
      where.type = { in: questionTypes };
    }

    // Always exclude questions that are part of other questions
    const partQuestionIds = await this.prisma.questionPart.findMany({
      select: { partQuestionId: true, questionId: true },
      distinct: ['partQuestionId'],
    });

    // Only exclude questions that are parts of OTHER questions (not themselves)
    const idsToExclude = partQuestionIds
      .filter((part) => part.partQuestionId !== part.questionId)
      .map((part) => part.partQuestionId);

    if (idsToExclude.length > 0) {
      where.id = { notIn: idsToExclude };
    }

    console.log('🔍 Final where clause:', JSON.stringify(where, null, 2));

    const questions = await this.prisma.question.findMany({
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

    console.log('🔍 Query returned', questions.length, 'questions');

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
