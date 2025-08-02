import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('QuestionsService', () => {
  let service: QuestionsService;
  const mockPrismaService = {
    question: {
      findMany: vi.fn(),
    },
    questionPart: {
      findMany: vi.fn(),
    },
    module: {
      findUnique: vi.fn(),
    },
  };

  beforeEach(() => {
    service = new QuestionsService(
      mockPrismaService as unknown as PrismaService,
    );
  });

  it('returns questions from prisma', async () => {
    const question = {
      id: 'q1',
      text: { en_text: 'Q', he_text: 'ש' },
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
    };
    mockPrismaService.question.findMany.mockResolvedValue([question]);
    mockPrismaService.questionPart.findMany.mockResolvedValue([]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].text.en_text).toBe('Q');
    expect(result[0].modules[0].name.en_text).toBe('mod');
  });
});
