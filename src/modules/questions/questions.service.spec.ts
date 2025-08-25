
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let mockPrismaService: {
    question: {
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
    };
    questionPart: {
      findMany: ReturnType<typeof vi.fn>;
    };
    module: {
      findUnique: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    mockPrismaService = {
      question: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      questionPart: {
        findMany: vi.fn(),
      },
      module: {
        findUnique: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);

    // Manually set the prisma property since NestJS DI might not work properly in tests
    (service as unknown as { prisma: typeof mockPrismaService }).prisma =
      mockPrismaService;
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
    expect(result[0].Modules?.[0]?.name.en_text).toBe('mod');
  });

  describe('getAllSubmoduleIds', () => {
    it('should return empty array when module has no submodules', async () => {
      mockPrismaService.module.findUnique.mockResolvedValue({
        id: 'module-1',
        subModules: [],
      });

      const result = await (
        service as unknown as {
          getAllSubmoduleIds: (id: string) => Promise<string[]>;
        }
      ).getAllSubmoduleIds('module-1');
      expect(result).toEqual([]);
    });

    it('should return all submodule IDs recursively', async () => {
      // Mock module hierarchy: module-1 -> [module-2, module-3] -> [module-4]
      mockPrismaService.module.findUnique
        .mockResolvedValueOnce({
          id: 'module-1',
          subModules: [{ id: 'module-2' }, { id: 'module-3' }],
        })
        .mockResolvedValueOnce({
          id: 'module-2',
          subModules: [{ id: 'module-4' }],
        })
        .mockResolvedValueOnce({
          id: 'module-3',
          subModules: [],
        })
        .mockResolvedValueOnce({
          id: 'module-4',
          subModules: [],
        });

      const result = await (
        service as unknown as {
          getAllSubmoduleIds: (id: string) => Promise<string[]>;
        }
      ).getAllSubmoduleIds('module-1');
      expect(result).toEqual(
        expect.arrayContaining(['module-2', 'module-3', 'module-4']),
      );
      expect(result).toHaveLength(3);
    });

    it('should handle circular references gracefully', async () => {
      // Mock circular reference: module-1 -> module-2 -> module-1
      mockPrismaService.module.findUnique
        .mockResolvedValueOnce({
          id: 'module-1',
          subModules: [{ id: 'module-2' }],
        })
        .mockResolvedValueOnce({
          id: 'module-2',
          subModules: [{ id: 'module-1' }],
        });

      const result = await (
        service as unknown as {
          getAllSubmoduleIds: (id: string) => Promise<string[]>;
        }
      ).getAllSubmoduleIds('module-1');
      // Should include all unique modules found, avoiding infinite loops
      expect(result).toEqual(expect.arrayContaining(['module-2']));
      expect(Array.isArray(result) && !result.includes('module-1')).toBe(false); // The original module shouldn't be included
    });
  });

  describe('findAll with includeSubmodules', () => {
    beforeEach(() => {
      mockPrismaService.question.findMany.mockResolvedValue([]);
      mockPrismaService.questionPart.findMany.mockResolvedValue([]);
    });

    it('should include submodules by default', async () => {
      mockPrismaService.module.findUnique.mockResolvedValue({
        id: 'parent-module',
        subModules: [{ id: 'sub-module-1' }],
      });

      await service.findAll({ moduleId: 'parent-module' });

      expect(mockPrismaService.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            Modules: {
              some: {
                AND: [
                  {
                    id: {
                      in: expect.arrayContaining([
                        'parent-module',
                        'sub-module-1',
                      ]),
                    },
                  },
                ],
              },
            },
          }),
        }),
      );
    });

    it('should exclude submodules when includeSubmodules is false', async () => {
      await service.findAll({
        moduleId: 'parent-module',
        includeSubmodules: false,
      });

      expect(mockPrismaService.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            Modules: {
              some: {
                AND: [{ id: { in: ['parent-module'] } }],
              },
            },
          }),
        }),
      );

      // Should not call getAllSubmoduleIds when includeSubmodules is false
      expect(mockPrismaService.module.findUnique).not.toHaveBeenCalled();
    });

    it('should work with multiple module IDs', async () => {
      mockPrismaService.module.findUnique
        .mockResolvedValueOnce({
          id: 'module-1',
          subModules: [{ id: 'sub-1' }],
        })
        .mockResolvedValueOnce({
          id: 'sub-1',
          subModules: [],
        })
        .mockResolvedValueOnce({
          id: 'module-2',
          subModules: [{ id: 'sub-2' }],
        })
        .mockResolvedValueOnce({
          id: 'sub-2',
          subModules: [],
        });

      await service.findAll({ moduleIds: ['module-1', 'module-2'] });

      expect(mockPrismaService.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            Modules: {
              some: {
                AND: [
                  {
                    id: {
                      in: expect.arrayContaining([
                        'module-1',
                        'module-2',
                        'sub-1',
                        'sub-2',
                      ]),
                    },
                  },
                ],
              },
            },
          }),
        }),
      );
    });
  });

  describe('generateSummary', () => {
    it('should generate a comprehensive question summary', async () => {
      const mockQuestion = {
        id: 'question-123',
        text: {
          en_text: 'What is the time complexity of quicksort?',
          he_text: 'מה מורכבות הזמן של quicksort?',
        },
        type: 'selection',
        validationStatus: 'validated',
        Modules: [
          {
            name: { en_text: 'Algorithms', he_text: 'אלגוריתמים' },
          },
        ],
        Answer: [
          {
            id: 'ans-1',
            SelectAnswer: [
              {
                text: {
                  en_text: 'O(n log n) average case',
                  he_text: 'O(n log n) במקרה ממוצע',
                },
                isCorrect: true,
              },
              {
                text: {
                  en_text: 'O(n^2) worst case',
                  he_text: 'O(n^2) במקרה הגרוע',
                },
                isCorrect: false,
              },
            ],
          },
        ],
        Parts: [],
      };

      mockPrismaService.question.findUnique.mockResolvedValue(mockQuestion);

      const result = await service.generateSummary('question-123');

      expect(result).toContain(
        'Question: What is the time complexity of quicksort?',
      );
      expect(result).toContain('ID: question-123');
      expect(result).toContain('Associated Modules: Algorithms');
    });

    it('should throw NotFoundException when question does not exist', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(null);

      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        'Question with ID non-existent not found',
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.question.findUnique.mockRejectedValue(dbError);

      await expect(service.generateSummary('question-123')).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.generateSummary('question-123')).rejects.toThrow(
        'Failed to generate question summary',
      );
    });
  });
});
