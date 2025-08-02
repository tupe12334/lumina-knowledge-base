import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UniversitiesService } from './universities.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UniversitiesService', () => {
  let service: UniversitiesService;
  const mockPrismaService = {
    university: {
      findMany: vi.fn(),
    },
  };

  beforeEach(() => {
    service = new UniversitiesService(
      mockPrismaService as unknown as PrismaService,
    );
  });

  it('returns universities from prisma', async () => {
    const university = {
      id: '1',
      name: { en_text: 'test', he_text: 'טסט' },
      courses: [
        {
          id: 'c1',
          name: { en_text: 'course', he_text: 'קורס' },
          universityId: '1',
          publishedAt: new Date(),
        },
      ],
    };
    mockPrismaService.university.findMany.mockResolvedValue([university]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('test');
    expect(result[0].courses[0].name.en_text).toBe('course');
  });
});
