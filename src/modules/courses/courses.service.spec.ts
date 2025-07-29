import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../../generated/client';
import { CoursesService } from './courses.service';
import { PrismaService } from '../../prisma/prisma.service';

vi.mock('../../../generated/client', async () => {
  const actual = (await vi.importActual(
    '../../../generated/client',
  )) as unknown as typeof client;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { ...actual, PrismaClient: createPrismock(actual.Prisma) };
});

let prisma: PrismaService;
let service: CoursesService;

beforeEach(() => {
  prisma = new PrismaService();
  service = new CoursesService(prisma);
});

describe('CoursesService', () => {
  it('returns courses from prisma', async () => {
    const uniName = await prisma.translation.create({
      data: { en_text: 'uni', he_text: 'אוני' },
    });
    const discName = await prisma.translation.create({
      data: { en_text: 'dis', he_text: 'תחום' },
    });
    const courseName = await prisma.translation.create({
      data: { en_text: 'course', he_text: 'קורס' },
    });

    await prisma.university.create({
      data: { id: 'u1', translationId: uniName.id },
    });
    await prisma.discipline.create({
      data: { id: 'd1', translationId: discName.id },
    });
    const publishDate = new Date();
    await prisma.course.create({
      data: {
        id: '1',
        translationId: courseName.id,
        universityId: 'u1',
        disciplineId: 'd1',
        publishedAt: publishDate,
      },
    });

    const result = await service.findAll();

    expect(result).toEqual([
      {
        id: '1',
        name: { en_text: 'course', he_text: 'קורס' },
        universityId: 'u1',
        disciplineId: 'd1',
        university: {
          id: 'u1',
          name: { en_text: 'uni', he_text: 'אוני' },
          courses: [],
        },
        discipline: { id: 'd1', enName: 'dis', heName: 'תחום', courses: [] },
        publishedAt: publishDate,
      },
    ]);
  });

  it('returns course from prisma', async () => {
    const uniName = await prisma.translation.create({
      data: { en_text: 'uni', he_text: 'אוני' },
    });
    const discName = await prisma.translation.create({
      data: { en_text: 'dis', he_text: 'תחום' },
    });
    const courseName = await prisma.translation.create({
      data: { en_text: 'course', he_text: 'קורס' },
    });

    await prisma.university.create({
      data: { id: 'u1', translationId: uniName.id },
    });
    await prisma.discipline.create({
      data: { id: 'd1', translationId: discName.id },
    });
    await prisma.course.create({
      data: {
        id: '1',
        translationId: courseName.id,
        universityId: 'u1',
        disciplineId: 'd1',
      },
    });

    const result = await service.findUnique('1');

    expect(result).toEqual({
      id: '1',
      name: { en_text: 'course', he_text: 'קורס' },
      universityId: 'u1',
      disciplineId: 'd1',
      university: {
        id: 'u1',
        name: { en_text: 'uni', he_text: 'אוני' },
        courses: [],
      },
      discipline: { id: 'd1', enName: 'dis', heName: 'תחום', courses: [] },
      publishedAt: null,
    });
  });
});
