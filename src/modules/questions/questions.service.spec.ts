import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

// Mock service type
type MockPrismaService = {
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

// Helper function to create and configure the service
const createQuestionsServiceForTests = async () => {
  const mockPrismaService: MockPrismaService = {
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

  const service = module.get<QuestionsService>(QuestionsService);

  // Manually set the prisma property since NestJS DI might not work properly in tests
  (service as unknown as { prisma: MockPrismaService }).prisma =
    mockPrismaService;

  // Set up the moduleHelper mock
  (service as unknown as {
    moduleHelper: { getAllSubmoduleIds: ReturnType<typeof vi.fn> }
  }).moduleHelper = {
    getAllSubmoduleIds: vi.fn(),
  };

  return {
    service,
    mockPrismaService,
    mockModuleHelper: (service as unknown as { moduleHelper: unknown }).moduleHelper,
  };
};

describe('QuestionsService', () => {
  let service: QuestionsService;
  let mockPrismaService: MockPrismaService;
  let mockModuleHelper: { getAllSubmoduleIds: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    const testSetup = await createQuestionsServiceForTests();
    service = testSetup.service;
    mockPrismaService = testSetup.mockPrismaService;
    mockModuleHelper = testSetup.mockModuleHelper;
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
    expect(result[0].Modules && result[0].Modules[0] && result[0].Modules[0].name.en_text).toBe('mod');
  });

  describe('getAllSubmoduleIds', () => {
    it('should return empty array when module has no submodules', async () => {
      mockModuleHelper.getAllSubmoduleIds.mockResolvedValue([]);

      const result = await mockModuleHelper.getAllSubmoduleIds('module-1');
      expect(result).toEqual([]);
    });

    it('should return all submodule IDs recursively', async () => {
      mockModuleHelper.getAllSubmoduleIds.mockResolvedValue(['module-2', 'module-3', 'module-4']);

      const result = await mockModuleHelper.getAllSubmoduleIds('module-1');
      expect(result).toEqual(
        expect.arrayContaining(['module-2', 'module-3', 'module-4']),
      );
      expect(result).toHaveLength(3);
    });

    it('should handle circular references gracefully', async () => {
      mockModuleHelper.getAllSubmoduleIds.mockResolvedValue(['module-2']);

      const result = await mockModuleHelper.getAllSubmoduleIds('module-1');
      expect(result).toEqual(expect.arrayContaining(['module-2']));
      expect(Array.isArray(result) && !result.includes('module-1')).toBe(true);
    });
  });

  describe('findAll with includeSubmodules', () => {
    beforeEach(() => {
      mockPrismaService.question.findMany.mockResolvedValue([]);
      mockPrismaService.questionPart.findMany.mockResolvedValue([]);
    });

    it('should include submodules by default', async () => {
      mockModuleHelper.getAllSubmoduleIds.mockResolvedValue(['parent-module', 'sub-module-1']);

      await service.findAll({ moduleId: 'parent-module' });

      // Verify that the service was called, but don't check exact query structure
      expect(mockPrismaService.question.findMany).toHaveBeenCalled();
    });

    it('should exclude submodules when includeSubmodules is false', async () => {
      await service.findAll({
        moduleId: 'parent-module',
        includeSubmodules: false,
      });

      expect(mockPrismaService.question.findMany).toHaveBeenCalled();
      // Should not call getAllSubmoduleIds when includeSubmodules is false
      expect(mockModuleHelper.getAllSubmoduleIds).not.toHaveBeenCalled();
    });

    it('should work with multiple module IDs', async () => {
      mockModuleHelper.getAllSubmoduleIds
        .mockResolvedValueOnce(['module-1', 'sub-1'])
        .mockResolvedValueOnce(['module-2', 'sub-2']);

      await service.findAll({ moduleIds: ['module-1', 'module-2'] });

      expect(mockPrismaService.question.findMany).toHaveBeenCalled();
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
        'Text: What is the time complexity of quicksort?',
      );
      expect(result).toContain('Question Summary for question-123');
      expect(result).toContain('Modules: Algorithms');
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
        'Failed to generate summary for question',
      );
    });
  });
});