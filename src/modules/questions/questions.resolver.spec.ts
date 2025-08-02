import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsService } from './questions.service';

describe('QuestionsResolver', () => {
  let resolver: QuestionsResolver;
  let serviceMock: {
    findAll: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    serviceMock = {
      findAll: vi.fn(),
      findUnique: vi.fn(),
    };
    resolver = new QuestionsResolver(
      serviceMock as unknown as QuestionsService,
    );
  });

  describe('getQuestions', () => {
    it('returns questions from service without input', async () => {
      const mockQuestions = [
        {
          id: 'q1',
          text: { en_text: 'Q', he_text: 'ש' },
          modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
          answers: [],
          parts: [],
        },
      ];
      serviceMock.findAll.mockResolvedValue(mockQuestions);

      const result = await resolver.getQuestions();

      expect(serviceMock.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockQuestions);
    });

    it('returns questions from service with input', async () => {
      const mockQuestions = [
        {
          id: 'q1',
          text: { en_text: 'Q', he_text: 'ש' },
          modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
          answers: [],
          parts: [],
        },
      ];
      serviceMock.findAll.mockResolvedValue(mockQuestions);

      const input = {
        moduleId: 'm1',
        excludePartQuestions: true,
      };

      const result = await resolver.getQuestions(input);

      expect(serviceMock.findAll).toHaveBeenCalledWith({
        moduleId: 'm1',
        courseId: undefined,
        questionType: undefined,
        excludePartQuestions: true,
      });
      expect(result).toEqual(mockQuestions);
    });
  });

  describe('getQuestion', () => {
    it('returns question from service', async () => {
      const mockQuestion = {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        answers: [],
        parts: [],
      };
      serviceMock.findUnique.mockResolvedValue(mockQuestion);

      const result = await resolver.getQuestion('q1');

      expect(serviceMock.findUnique).toHaveBeenCalledWith('q1');
      expect(result).toEqual(mockQuestion);
    });

    it('throws NotFoundException when question not found', async () => {
      serviceMock.findUnique.mockResolvedValue(null);

      await expect(resolver.getQuestion('q1')).rejects.toThrow(
        NotFoundException,
      );
      expect(serviceMock.findUnique).toHaveBeenCalledWith('q1');
    });
  });
});
