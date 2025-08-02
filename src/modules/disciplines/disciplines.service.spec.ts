import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DisciplinesService } from './disciplines.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DisciplinesService', () => {
  let service: DisciplinesService;
  const mockPrismaService = {
    discipline: {
      findMany: vi.fn(),
    },
  };

  beforeEach(() => {
    service = new DisciplinesService(mockPrismaService as unknown as PrismaService);
  });

  it('returns disciplines from prisma', async () => {
    const discipline = {
      id: '1',
      name: { en_text: 'discipline', he_text: 'תחום' },
      courses: [
        {
          id: 'c1',
          name: { en_text: 'course', he_text: 'קורס' },
          universityId: 'u1',
          disciplineId: '1',
          publishedAt: new Date(),
        },
      ],
    };
    mockPrismaService.discipline.findMany.mockResolvedValue([discipline]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('discipline');
    expect(result[0].courses[0].name.en_text).toBe('course');
  });
});
