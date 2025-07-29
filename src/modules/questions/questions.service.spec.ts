import { describe, it, expect, vi } from 'vitest';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('QuestionsService', () => {
  it('returns questions from prisma', async () => {
    const findManyMock = vi.fn().mockResolvedValue([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        Modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        Answer: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        Parts: [],
      },
    ]);
    const prisma = {
      question: {
        findMany: findManyMock,
      },
    } as unknown as PrismaService;

    const service = new QuestionsService(prisma);
    const result = await service.findAll();

    expect(findManyMock).toHaveBeenCalledWith({
      where: {},
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
              },
            },
          },
        },
      },
    });

    expect(result).toEqual([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        answers: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        parts: [],
      },
    ]);
  });

  it('returns questions filtered by moduleId', async () => {
    const findManyMock = vi.fn().mockResolvedValue([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        Modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        Answer: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        Parts: [],
      },
    ]);
    const prisma = {
      question: {
        findMany: findManyMock,
      },
    } as unknown as PrismaService;

    const service = new QuestionsService(prisma);
    const result = await service.findAll({ moduleId: 'm1' });

    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        Modules: { some: { id: 'm1' } },
      },
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
              },
            },
          },
        },
      },
    });

    expect(result).toEqual([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        answers: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        parts: [],
      },
    ]);
  });

  it('returns questions filtered by courseId', async () => {
    const findManyMock = vi.fn().mockResolvedValue([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        Modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        Answer: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        Parts: [],
      },
    ]);
    const prisma = {
      question: {
        findMany: findManyMock,
      },
    } as unknown as PrismaService;

    const service = new QuestionsService(prisma);
    const result = await service.findAll({ courseId: 'c1' });

    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        Modules: {
          some: {
            Course: {
              some: { id: 'c1' },
            },
          },
        },
      },
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
              },
            },
          },
        },
      },
    });

    expect(result).toEqual([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        answers: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        parts: [],
      },
    ]);
  });

  it('returns question from prisma', async () => {
    const prisma = {
      question: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'q1',
          text: { en_text: 'Q', he_text: 'ש' },
          moduleId: 'm1',
          Modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
          Answer: [
            {
              id: 'a1',
              questionId: 'q1',
              SelectAnswer: [
                { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
              ],
              UnitAnswer: null,
            },
          ],
          Parts: [],
        }),
      },
    } as unknown as PrismaService;

    const service = new QuestionsService(prisma);
    const result = await service.findUnique('q1');

    expect(result).toEqual({
      id: 'q1',
      text: { en_text: 'Q', he_text: 'ש' },
      moduleId: 'm1',
      modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
      answers: [
        {
          id: 'a1',
          questionId: 'q1',
          SelectAnswer: [
            { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
          ],
          UnitAnswer: null,
        },
      ],
      parts: [],
    });
  });

  it('returns questions filtered by excludePartQuestions when true', async () => {
    const findManyMockQuestionPart = vi.fn().mockResolvedValue([
      { partQuestionId: 'q2', questionId: 'q1' }, // q2 is part of q1
      { partQuestionId: 'q3', questionId: 'q1' }, // q3 is part of q1
      { partQuestionId: 'q1', questionId: 'q1' }, // q1 is part of itself (should not be excluded)
    ]);
    const findManyMockQuestion = vi.fn().mockResolvedValue([
      {
        id: 'q1',
        text: { en_text: 'Q1', he_text: 'ש1' },
        moduleId: 'm1',
        Modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        Answer: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        Parts: [],
      },
    ]);

    const prisma = {
      questionPart: {
        findMany: findManyMockQuestionPart,
      },
      question: {
        findMany: findManyMockQuestion,
      },
    } as unknown as PrismaService;

    const service = new QuestionsService(prisma);
    const result = await service.findAll({ excludePartQuestions: true });

    expect(findManyMockQuestionPart).toHaveBeenCalledWith({
      select: { partQuestionId: true, questionId: true },
      distinct: ['partQuestionId'],
    });
    expect(findManyMockQuestion).toHaveBeenCalledWith({
      where: {
        id: { notIn: ['q2', 'q3'] }, // q1 should not be excluded since it references itself
      },
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
              },
            },
          },
        },
      },
    });

    expect(result).toEqual([
      {
        id: 'q1',
        text: { en_text: 'Q1', he_text: 'ש1' },
        moduleId: 'm1',
        modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        answers: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        parts: [],
      },
    ]);
  });

  it('returns all questions when excludePartQuestions is false', async () => {
    const findManyMock = vi.fn().mockResolvedValue([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        Modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        Answer: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        Parts: [],
      },
    ]);
    const prisma = {
      question: {
        findMany: findManyMock,
      },
    } as unknown as PrismaService;

    const service = new QuestionsService(prisma);
    const result = await service.findAll({ excludePartQuestions: false });

    expect(findManyMock).toHaveBeenCalledWith({
      where: {},
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
              },
            },
          },
        },
      },
    });

    expect(result).toEqual([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        answers: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        parts: [],
      },
    ]);
  });

  it('returns questions without exclusion when no part questions exist', async () => {
    const findManyMockQuestionPart = vi.fn().mockResolvedValue([]);
    const findManyMockQuestion = vi.fn().mockResolvedValue([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        Modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        Answer: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        Parts: [],
      },
    ]);

    const prisma = {
      questionPart: {
        findMany: findManyMockQuestionPart,
      },
      question: {
        findMany: findManyMockQuestion,
      },
    } as unknown as PrismaService;

    const service = new QuestionsService(prisma);
    const result = await service.findAll({ excludePartQuestions: true });

    expect(findManyMockQuestionPart).toHaveBeenCalledWith({
      select: { partQuestionId: true, questionId: true },
      distinct: ['partQuestionId'],
    });
    expect(findManyMockQuestion).toHaveBeenCalledWith({
      where: {},
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: { include: { SelectAnswer: true, UnitAnswer: true } },
              },
            },
          },
        },
      },
    });

    expect(result).toEqual([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        answers: [
          {
            id: 'a1',
            questionId: 'q1',
            SelectAnswer: [
              { id: 'sa1', isCorrect: true, text: 'ans', answerId: 'a1' },
            ],
            UnitAnswer: null,
          },
        ],
        parts: [],
      },
    ]);
  });
});
