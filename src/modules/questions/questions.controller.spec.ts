import { describe, it, expect, vi } from 'vitest';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

describe('QuestionsController', () => {
  it('gets questions from service', async () => {
    const findAllMock = vi.fn().mockResolvedValue([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        module: { id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } },
        answers: [
          {
            id: 'a1',
            text: 'ans',
            isCorrect: true,
            questionId: 'q1',
          },
        ],
      },
    ]);
    const service = {
      findAll: findAllMock,
    } as unknown as QuestionsService;

    const controller = new QuestionsController(service);
    const result = await controller.getQuestions({});

    expect(result).toEqual([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        module: { id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } },
        answers: [
          {
            id: 'a1',
            text: 'ans',
            isCorrect: true,
            questionId: 'q1',
          },
        ],
      },
    ]);
  });

  it('gets questions filtered by moduleId', async () => {
    const findAllMock = vi.fn().mockResolvedValue([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        module: { id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } },
        answers: [
          {
            id: 'a1',
            text: 'ans',
            isCorrect: true,
            questionId: 'q1',
          },
        ],
      },
    ]);
    const service = {
      findAll: findAllMock,
    } as unknown as QuestionsService;

    const controller = new QuestionsController(service);
    const result = await controller.getQuestions({ moduleId: 'm1' });

    expect(findAllMock).toHaveBeenCalledWith({ moduleId: 'm1' });
    expect(result).toEqual([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        module: { id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } },
        answers: [
          {
            id: 'a1',
            text: 'ans',
            isCorrect: true,
            questionId: 'q1',
          },
        ],
      },
    ]);
  });

  it('gets questions filtered by courseId', async () => {
    const findAllMock = vi.fn().mockResolvedValue([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        answers: [
          {
            id: 'a1',
            text: 'ans',
            isCorrect: true,
            questionId: 'q1',
          },
        ],
      },
    ]);
    const service = {
      findAll: findAllMock,
    } as unknown as QuestionsService;

    const controller = new QuestionsController(service);
    const result = await controller.getQuestions({ courseId: 'c1' });

    expect(findAllMock).toHaveBeenCalledWith({ courseId: 'c1' });
    expect(result).toEqual([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        modules: [{ id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } }],
        answers: [
          {
            id: 'a1',
            text: 'ans',
            isCorrect: true,
            questionId: 'q1',
          },
        ],
      },
    ]);
  });

  it('gets questions filtered by excludePartQuestions', async () => {
    const findAllMock = vi.fn().mockResolvedValue([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        module: { id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } },
        answers: [
          {
            id: 'a1',
            text: 'ans',
            isCorrect: true,
            questionId: 'q1',
          },
        ],
      },
    ]);
    const service = {
      findAll: findAllMock,
    } as unknown as QuestionsService;

    const controller = new QuestionsController(service);
    const result = await controller.getQuestions({
      excludePartQuestions: true,
    });

    expect(findAllMock).toHaveBeenCalledWith({
      excludePartQuestions: true,
    });
    expect(result).toEqual([
      {
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        module: { id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } },
        answers: [
          {
            id: 'a1',
            text: 'ans',
            isCorrect: true,
            questionId: 'q1',
          },
        ],
      },
    ]);
  });

  it('gets a question from service', async () => {
    const service = {
      findUnique: vi.fn().mockResolvedValue({
        id: 'q1',
        text: { en_text: 'Q', he_text: 'ש' },
        moduleId: 'm1',
        module: { id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } },
        answers: [
          {
            id: 'a1',
            text: 'ans',
            isCorrect: true,
            questionId: 'q1',
          },
        ],
      }),
    } as unknown as QuestionsService;

    const controller = new QuestionsController(service);
    const result = await controller.getQuestion('q1');

    expect(result).toEqual({
      id: 'q1',
      text: { en_text: 'Q', he_text: 'ש' },
      moduleId: 'm1',
      module: { id: 'm1', name: { en_text: 'mod', he_text: 'מודול' } },
      answers: [
        {
          id: 'a1',
          text: 'ans',
          isCorrect: true,
          questionId: 'q1',
        },
      ],
    });
  });
});
