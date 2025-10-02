import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QuestionsService } from './questions.service';
import { QuestionsQueryService } from './services/questions-query.service';
import { QuestionsCrudService } from './services/questions-crud.service';
import { QuestionsSummaryService } from './services/questions-summary.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let mockQueryService: Partial<QuestionsQueryService>;
  let mockCrudService: Partial<QuestionsCrudService>;
  let mockSummaryService: Partial<QuestionsSummaryService>;

  beforeEach(() => {
    mockQueryService = {
      findAll: vi.fn(),
      findUnique: vi.fn(),
    };
    mockCrudService = {};
    mockSummaryService = {
      generateSummary: vi.fn(),
    };
    // @ts-expect-error - Mocking services for tests
    service = new QuestionsService(mockQueryService, mockCrudService, mockSummaryService);
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
    if (mockQueryService.findAll) {
      vi.mocked(mockQueryService.findAll).mockResolvedValue([question]);
    }

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].text.en_text).toBe('Q');
    expect(result[0].Modules && result[0].Modules[0] && result[0].Modules[0].name.en_text).toBe('mod');
  });


  describe('generateSummary', () => {
    it('should generate a comprehensive question summary', async () => {
      const mockSummary = `Question Summary for question-123
Text: What is the time complexity of quicksort?
Type: selection
Validation Status: validated
Modules: Algorithms
Answers:
- O(n log n) average case (correct)
- O(n^2) worst case (incorrect)`;

      if (mockSummaryService.generateSummary) {
        vi.mocked(mockSummaryService.generateSummary).mockResolvedValue(mockSummary);
      }

      const result = await service.generateSummary('question-123');

      expect(result).toContain(
        'Text: What is the time complexity of quicksort?',
      );
      expect(result).toContain('Question Summary for question-123');
      expect(result).toContain('Modules: Algorithms');
    });

    it('should throw NotFoundException when question does not exist', async () => {
      if (mockSummaryService.generateSummary) {
        vi.mocked(mockSummaryService.generateSummary).mockRejectedValue(
          new NotFoundException('Question with ID non-existent not found'),
        );
      }

      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        'Question with ID non-existent not found',
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      if (mockSummaryService.generateSummary) {
        vi.mocked(mockSummaryService.generateSummary).mockRejectedValue(
          new InternalServerErrorException('Failed to generate summary for question'),
        );
      }

      await expect(service.generateSummary('question-123')).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.generateSummary('question-123')).rejects.toThrow(
        'Failed to generate summary for question',
      );
    });
  });
});