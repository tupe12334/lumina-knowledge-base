import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../../generated/client';
import { UniversitiesService } from './universities.service';
import { PrismaService } from '../../prisma/prisma.service';

vi.mock('../../../generated/client', async () => {
  const actual = (await vi.importActual(
    '../../../generated/client',
  )) as unknown as typeof client;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { ...actual, PrismaClient: createPrismock(actual.Prisma) };
});

let prisma: PrismaService;
let service: UniversitiesService;

beforeEach(() => {
  prisma = new PrismaService();
  service = new UniversitiesService(prisma);
});

describe('UniversitiesService', () => {
  it('returns universities from prisma', async () => {
    const uniName = await prisma.translation.create({
      data: { en_text: 'test', he_text: 'טסט' },
    });
    const discName = await prisma.translation.create({
      data: { en_text: 'dis', he_text: 'תחום' },
    });
    const courseName = await prisma.translation.create({
      data: { en_text: 'course', he_text: 'קורס' },
    });

    await prisma.discipline.create({
      data: { id: 'd1', translationId: discName.id },
    });
    await prisma.university.create({
      data: { id: '1', translationId: uniName.id },
    });
    await prisma.course.create({
      data: {
        id: 'c1',
        translationId: courseName.id,
        universityId: '1',
        disciplineId: 'd1',
        publishedAt: new Date(),
      },
    });

    const result = await service.findAll();

    expect(result).toEqual([
      {
        id: '1',
        name: { en_text: 'test', he_text: 'טסט' },
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
    expect(result[0].courses[0].publishedAt).toBeInstanceOf(Date);
  });

  it('returns university from prisma', async () => {
    const uniName = await prisma.translation.create({
      data: { en_text: 'test', he_text: 'טסט' },
    });
    const discName = await prisma.translation.create({
      data: { en_text: 'dis', he_text: 'תחום' },
    });
    const courseName = await prisma.translation.create({
      data: { en_text: 'course', he_text: 'קורס' },
    });

    await prisma.discipline.create({
      data: { id: 'd1', translationId: discName.id },
    });
    await prisma.university.create({
      data: { id: '1', translationId: uniName.id },
    });
    await prisma.course.create({
      data: {
        id: 'c1',
        translationId: courseName.id,
        universityId: '1',
        disciplineId: 'd1',
      },
    });

    const result = await service.findUnique('1');

    expect(result).toEqual({
      id: '1',
      name: { en_text: 'test', he_text: 'טסט' },
      courses: [
        {
          id: 'c1',
          name: { en_text: 'course', he_text: 'קורס' },
          universityId: '1',
          disciplineId: 'd1',
          publishedAt: null,
          discipline: { id: 'd1', enName: 'dis', heName: 'תחום', courses: [] },
        },
      ],
    });
  });
});
