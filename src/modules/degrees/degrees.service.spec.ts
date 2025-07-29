import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../../generated/client';
import { DegreesService } from './degrees.service';
import { PrismaService } from '../../prisma/prisma.service';

vi.mock('../../../generated/client', async () => {
  const actual = (await vi.importActual(
    '../../../generated/client',
  )) as unknown as typeof client;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { ...actual, PrismaClient: createPrismock(actual.Prisma) };
});

let prisma: PrismaService;
let service: DegreesService;

beforeEach(() => {
  prisma = new PrismaService();
  service = new DegreesService(prisma);
});

describe('DegreesService', () => {
  it('returns degrees from prisma', async () => {
    const degreeName = await prisma.translation.create({
      data: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
    });
    const uniName = await prisma.translation.create({
      data: {
        en_text: 'University of Technology',
        he_text: 'האוניברסיטה הטכנולוגית',
      },
    });
    const discName = await prisma.translation.create({
      data: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
    });
    const courseName = await prisma.translation.create({
      data: { en_text: 'Data Structures', he_text: 'מבני נתונים' },
    });

    await prisma.university.create({
      data: { id: 'uni1', translationId: uniName.id },
    });
    await prisma.discipline.create({
      data: { id: 'd1', translationId: discName.id },
    });
    await prisma.degree.create({
      data: { id: 'deg1', translationId: degreeName.id, universityId: 'uni1' },
    });
    await prisma.course.create({
      data: {
        id: 'c1',
        translationId: courseName.id,
        universityId: 'uni1',
        disciplineId: 'd1',
        publishedAt: new Date(),
      },
    });

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('Computer Science');
    expect(result[0].university?.name.en_text).toBe('University of Technology');
  });

  it('returns specific degree by id', async () => {
    const degreeName = await prisma.translation.create({
      data: { en_text: 'Software Engineering', he_text: 'הנדסת תוכנה' },
    });
    const uniName = await prisma.translation.create({
      data: { en_text: 'Tech University', he_text: 'האוניברסיטה הטכנולוגית' },
    });

    await prisma.university.create({
      data: { id: 'uni1', translationId: uniName.id },
    });
    const createdDegree = await prisma.degree.create({
      data: { id: 'deg1', translationId: degreeName.id, universityId: 'uni1' },
    });

    const result = await service.findUnique('deg1');

    expect(result).toBeDefined();
    expect(result?.name.en_text).toBe('Software Engineering');
    expect(result?.id).toBe(createdDegree.id);
  });

  it('returns null when degree not found', async () => {
    const result = await service.findUnique('nonexistent-id');
    expect(result).toBeNull();
  });

  it('returns degrees by university id', async () => {
    const degreeName1 = await prisma.translation.create({
      data: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
    });
    const degreeName2 = await prisma.translation.create({
      data: { en_text: 'Software Engineering', he_text: 'הנדסת תוכנה' },
    });
    const uniName = await prisma.translation.create({
      data: {
        en_text: 'University of Technology',
        he_text: 'האוניברסיטה הטכנולוגית',
      },
    });

    await prisma.university.create({
      data: { id: 'uni1', translationId: uniName.id },
    });
    await prisma.degree.create({
      data: { id: 'deg1', translationId: degreeName1.id, universityId: 'uni1' },
    });
    await prisma.degree.create({
      data: { id: 'deg2', translationId: degreeName2.id, universityId: 'uni1' },
    });

    const result = await service.findByUniversityId('uni1');

    expect(result).toHaveLength(2);
    expect(result.map((d) => d.name.en_text)).toContain('Computer Science');
    expect(result.map((d) => d.name.en_text)).toContain('Software Engineering');
  });

  it('handles courses with published status correctly', async () => {
    const degreeName = await prisma.translation.create({
      data: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
    });
    const uniName = await prisma.translation.create({
      data: {
        en_text: 'University of Technology',
        he_text: 'האוניברסיטה הטכנולוגית',
      },
    });
    const discName = await prisma.translation.create({
      data: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
    });
    const courseName1 = await prisma.translation.create({
      data: { en_text: 'Published Course', he_text: 'קורס מפורסם' },
    });
    const courseName2 = await prisma.translation.create({
      data: { en_text: 'Unpublished Course', he_text: 'קורס לא מפורסם' },
    });

    await prisma.university.create({
      data: { id: 'uni1', translationId: uniName.id },
    });
    await prisma.discipline.create({
      data: { id: 'd1', translationId: discName.id },
    });
    const degree = await prisma.degree.create({
      data: { id: 'deg1', translationId: degreeName.id, universityId: 'uni1' },
    });
    await prisma.course.create({
      data: {
        id: 'c1',
        translationId: courseName1.id,
        universityId: 'uni1',
        disciplineId: 'd1',
        publishedAt: new Date(),
        Degree: { connect: { id: degree.id } },
      },
    });
    await prisma.course.create({
      data: {
        id: 'c2',
        translationId: courseName2.id,
        universityId: 'uni1',
        disciplineId: 'd1',
        publishedAt: null,
        Degree: { connect: { id: degree.id } },
      },
    });

    const result = await service.findUnique('deg1');

    expect(result?.courses).toHaveLength(2);
    const publishedCourse = result?.courses?.find(
      (c) => c.name.en_text === 'Published Course',
    );
    const unpublishedCourse = result?.courses?.find(
      (c) => c.name.en_text === 'Unpublished Course',
    );

    expect(publishedCourse?.publishedAt).toBeInstanceOf(Date);
    expect(unpublishedCourse?.publishedAt).toBeNull();
  });

  it('returns degrees by university id and discipline id', async () => {
    const degreeName1 = await prisma.translation.create({
      data: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
    });
    const degreeName2 = await prisma.translation.create({
      data: { en_text: 'Software Engineering', he_text: 'הנדסת תוכנה' },
    });
    const uniName = await prisma.translation.create({
      data: {
        en_text: 'University of Technology',
        he_text: 'האוניברסיטה הטכנולוגית',
      },
    });
    const discName1 = await prisma.translation.create({
      data: { en_text: 'CS', he_text: 'מדעי המחשב' },
    });
    const discName2 = await prisma.translation.create({
      data: { en_text: 'Math', he_text: 'מתמטיקה' },
    });
    await prisma.university.create({
      data: { id: 'uni1', translationId: uniName.id },
    });
    await prisma.discipline.create({
      data: { id: 'd1', translationId: discName1.id },
    });
    await prisma.discipline.create({
      data: { id: 'd2', translationId: discName2.id },
    });
    const deg1 = await prisma.degree.create({
      data: { id: 'deg1', translationId: degreeName1.id, universityId: 'uni1' },
    });
    const deg2 = await prisma.degree.create({
      data: { id: 'deg2', translationId: degreeName2.id, universityId: 'uni1' },
    });
    await prisma.course.create({
      data: {
        id: 'c1',
        translationId: discName1.id,
        universityId: 'uni1',
        disciplineId: 'd1',
        publishedAt: new Date(),
        Degree: { connect: { id: deg1.id } },
      },
    });
    await prisma.course.create({
      data: {
        id: 'c2',
        translationId: discName2.id,
        universityId: 'uni1',
        disciplineId: 'd2',
        publishedAt: new Date(),
        Degree: { connect: { id: deg1.id } },
      },
    });
    await prisma.course.create({
      data: {
        id: 'c3',
        translationId: discName1.id,
        universityId: 'uni1',
        disciplineId: 'd1',
        publishedAt: new Date(),
        Degree: { connect: { id: deg2.id } },
      },
    });
    const result = await service.findByUniversityIdAndDisciplineId(
      'uni1',
      'd1',
    );
    expect(result).toHaveLength(2);
    for (const degree of result) {
      for (const course of degree.courses) {
        expect(course.disciplineId).toBe('d1');
      }
    }
  });
});
