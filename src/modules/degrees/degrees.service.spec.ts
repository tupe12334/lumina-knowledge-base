import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DegreesService } from './degrees.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DegreesService', () => {
  let service: DegreesService;
  const mockPrismaService = {
    degree: {
      findMany: vi.fn(),
    },
  };

  beforeEach(() => {
    service = new DegreesService(mockPrismaService as unknown as PrismaService);
  });

  it('returns degrees from prisma', async () => {
    const degree = {
      id: 'deg1',
      name: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
      university: {
        name: { en_text: 'University of Technology', he_text: 'האוניברסיטה הטכנולוגית' },
      },
    };
    mockPrismaService.degree.findMany.mockResolvedValue([degree]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('Computer Science');
    expect(result[0].university?.name.en_text).toBe('University of Technology');
  });
});
