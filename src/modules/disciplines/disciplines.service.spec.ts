import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../../generated/client';
import { DisciplinesService } from './disciplines.service';
import { PrismaService } from '../../prisma/prisma.service';

vi.mock('../../../generated/client', async () => {
  const actual = (await vi.importActual(
    '../../../generated/client',
  )) as unknown as typeof client;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { ...actual, PrismaClient: createPrismock(actual.Prisma) };
});

let prisma: PrismaService;
let service: DisciplinesService;

beforeEach(() => {
  prisma = new PrismaService();
  service = new DisciplinesService(prisma);
});

describe('DisciplinesService', () => {
  it('returns disciplines from prisma', async () => {
    const discName = await prisma.translation.create({
      data: { en_text: 'discipline', he_text: 'תחום' },
    });
    const courseName = await prisma.translation.create({
      data: { en_text: 'course', he_text: 'קורס' },
    });

    await prisma.discipline.create({
      data: { id: '1', translationId: discName.id },
    });
    await prisma.course.create({
      data: {
        id: 'c1',
        translationId: courseName.id,
        universityId: 'u1',
        disciplineId: '1',
        publishedAt: new Date(),
      },
    });

    const result = await service.findAll();

    expect(result).toEqual([
      {
        id: '1',
        name: { en_text: 'discipline', he_text: 'תחום' },
        courses: [
          {
            id: 'c1',
            name: { en_text: 'course', he_text: 'קורס' },
            universityId: 'u1',
            disciplineId: '1',
          },
        ],
      },
    ]);
    expect(result[0].courses[0].publishedAt).toBeInstanceOf(Date);
  });

  it('returns discipline from prisma', async () => {
    const discName = await prisma.translation.create({
      data: { en_text: 'discipline', he_text: 'תחום' },
    });
    const courseName = await prisma.translation.create({
      data: { en_text: 'course', he_text: 'קורס' },
    });

    await prisma.discipline.create({
      data: { id: '1', translationId: discName.id },
    });
    await prisma.course.create({
      data: {
        id: 'c1',
        translationId: courseName.id,
        universityId: 'u1',
        disciplineId: '1',
      },
    });

    const result = await service.findUnique('1');

    expect(result).toEqual({
      id: '1',
      name: { en_text: 'discipline', he_text: 'תחום' },
      courses: [
        {
          id: 'c1',
          name: { en_text: 'course', he_text: 'קורס' },
          universityId: 'u1',
          disciplineId: '1',
          publishedAt: null,
        },
      ],
    });
  });
});
