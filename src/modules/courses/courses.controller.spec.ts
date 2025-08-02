import { describe, it, expect, vi } from 'vitest';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

describe('CoursesController', () => {
  it('gets courses from service', async () => {
    const service = {
      findAll: vi.fn().mockResolvedValue([
        {
          id: '1',
          name: { en_text: 'course', he_text: 'קורס' },
          universityId: 'u1',
          university: {
            id: 'u1',
            name: { en_text: 'uni', he_text: 'אוני' },
            courses: [],
          },
        },
      ]),
    } as unknown as CoursesService;

    const controller = new CoursesController(service);
    const result = await controller.getCourses();

    expect(result).toEqual([
      {
        id: '1',
        name: { en_text: 'course', he_text: 'קורס' },
        universityId: 'u1',
        university: {
          id: 'u1',
          name: { en_text: 'uni', he_text: 'אוני' },
          courses: [],
        },
      },
    ]);
  });

  it('gets a course from service', async () => {
    const service = {
      findUnique: vi.fn().mockResolvedValue({
        id: '1',
        name: { en_text: 'course', he_text: 'קורס' },
        universityId: 'u1',
        university: {
          id: 'u1',
          name: { en_text: 'uni', he_text: 'אוני' },
          courses: [],
        },
      }),
    } as unknown as CoursesService;

    const controller = new CoursesController(service);
    const result = await controller.getCourse('1');

    expect(result).toEqual({
      id: '1',
      name: { en_text: 'course', he_text: 'קורס' },
      universityId: 'u1',
      university: {
        id: 'u1',
        name: { en_text: 'uni', he_text: 'אוני' },
        courses: [],
      },
    });
  });
});
