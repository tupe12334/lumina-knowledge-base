import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CoursesService } from './courses.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CoursesService', () => {
  let service: CoursesService;
  const mockPrismaService = {
    course: {
      findMany: vi.fn(),
    },
  };

  beforeEach(() => {
    service = new CoursesService(mockPrismaService as unknown as PrismaService);
  });

  it('returns courses from prisma', async () => {
    const course = {
      id: '1',
      name: { en_text: 'course', he_text: 'קורס' },
      universityId: 'u1',
      publishedAt: new Date(),
      university: {
        id: 'u1',
        name: { en_text: 'uni', he_text: 'אוני' },
      },
    };
    mockPrismaService.course.findMany.mockResolvedValue([course]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('course');
    expect(result[0].university).toBeDefined();
    expect(result[0].university!.name.en_text).toBe('uni');
  });
});
