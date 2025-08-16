import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FacultiesService } from './faculties.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('FacultiesService', () => {
  let service: FacultiesService;
  const prisma = {
    faculty: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };

  beforeEach(() => {
    prisma.faculty.findMany.mockReset();
    prisma.faculty.findUnique.mockReset();
    service = new FacultiesService(prisma as unknown as PrismaService);
  });

  it('getFacultiesByUniversity queries prisma with includes', async () => {
    const data = [{ id: 'f1' }];
    prisma.faculty.findMany.mockResolvedValue(data);
    const res = await service.getFacultiesByUniversity('u1');
    expect(res).toBe(data);
    expect(prisma.faculty.findMany).toHaveBeenCalledWith({
      where: { universityId: 'u1' },
      include: { name: true, description: true },
    });
  });

  it('getFacultyById queries prisma with includes', async () => {
    const data = { id: 'f1' };
    prisma.faculty.findUnique.mockResolvedValue(data);
    const res = await service.getFacultyById('f1');
    expect(res).toBe(data);
    expect(prisma.faculty.findUnique).toHaveBeenCalledWith({
      where: { id: 'f1' },
      include: { name: true, description: true },
    });
  });
});
