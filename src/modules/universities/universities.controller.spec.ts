import { describe, it, expect, vi } from 'vitest';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';

describe('UniversitiesController', () => {
  it('gets universities from service', async () => {
    const service = {
      findAll: vi.fn().mockResolvedValue([
        {
          id: '1',
          name: { en_text: 'uni', he_text: 'אוני' },
          courses: [
            {
              id: 'c1',
              name: { en_text: 'course', he_text: 'קורס' },
              universityId: '1',
              disciplineId: 'd1',
              discipline: {
                id: 'd1',
                enName: 'dis',
                heName: 'תחום',
                courses: [],
              },
            },
          ],
        },
      ]),
    } as unknown as UniversitiesService;

    const controller = new UniversitiesController(service);
    const result = await controller.getUniversities();

    expect(result).toEqual([
      {
        id: '1',
        name: { en_text: 'uni', he_text: 'אוני' },
        courses: [
          {
            id: 'c1',
            name: { en_text: 'course', he_text: 'קורס' },
            universityId: '1',
            disciplineId: 'd1',
            discipline: {
              id: 'd1',
              enName: 'dis',
              heName: 'תחום',
              courses: [],
            },
          },
        ],
      },
    ]);
  });

  it('gets a university from service', async () => {
    const service = {
      findUnique: vi.fn().mockResolvedValue({
        id: '1',
        name: { en_text: 'uni', he_text: 'אוני' },
        courses: [
          {
            id: 'c1',
            name: { en_text: 'course', he_text: 'קורס' },
            universityId: '1',
            disciplineId: 'd1',
            discipline: {
              id: 'd1',
              enName: 'dis',
              heName: 'תחום',
              courses: [],
            },
          },
        ],
      }),
    } as unknown as UniversitiesService;

    const controller = new UniversitiesController(service);
    const result = await controller.getUniversity('1');

    expect(result).toEqual({
      id: '1',
      name: { en_text: 'uni', he_text: 'אוני' },
      courses: [
        {
          id: 'c1',
          name: { en_text: 'course', he_text: 'קורס' },
          universityId: '1',
          disciplineId: 'd1',
          discipline: { id: 'd1', enName: 'dis', heName: 'תחום', courses: [] },
        },
      ],
    });
  });
});
