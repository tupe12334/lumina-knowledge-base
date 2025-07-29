import { describe, it, expect, vi } from 'vitest';
import { DisciplinesController } from './disciplines.controller';
import { DisciplinesService } from './disciplines.service';

describe('DisciplinesController', () => {
  it('gets disciplines from service', async () => {
    const service = {
      findAll: vi.fn().mockResolvedValue([
        {
          id: '1',
          name: { en_text: 'discipline', he_text: 'תחום' },
          courses: [],
        },
      ]),
    } as unknown as DisciplinesService;

    const controller = new DisciplinesController(service);
    const result = await controller.getDisciplines();

    expect(result).toEqual([
      {
        id: '1',
        name: { en_text: 'discipline', he_text: 'תחום' },
        courses: [],
      },
    ]);
  });

  it('gets a discipline from service', async () => {
    const service = {
      findUnique: vi.fn().mockResolvedValue({
        id: '1',
        name: { en_text: 'discipline', he_text: 'תחום' },
        courses: [],
      }),
    } as unknown as DisciplinesService;

    const controller = new DisciplinesController(service);
    const result = await controller.getDiscipline('1');

    expect(result).toEqual({
      id: '1',
      name: { en_text: 'discipline', he_text: 'תחום' },
      courses: [],
    });
  });
});
