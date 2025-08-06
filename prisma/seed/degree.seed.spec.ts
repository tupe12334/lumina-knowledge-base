import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../generated/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { seedDegrees, degreeSeeds } from './degree.seed';
import { degreeCourses } from './degrees.consts.seed';
import { SeedCache } from './cache';

vi.mock('../../generated/client', async () => {
  const actual = (await vi.importActual(
    '../../generated/client',
  )) as unknown as typeof client;
  return { ...actual, PrismaClient: createPrismock(actual.Prisma) };
});

let prisma: PrismaService;

beforeEach(() => {
  prisma = new PrismaService();
});

describe('seedDegrees', () => {
  it('creates degrees with courses', async () => {
    for (const seed of degreeSeeds) {
      const uniTranslation = await prisma.translation.create({
        data: { en_text: seed.university, he_text: seed.university },
      });
      await prisma.university.create({
        data: { id: `u-${seed.id}`, translationId: uniTranslation.id },
      });

      const degreeTranslation = await prisma.translation.create({
        data: { en_text: seed.enText, he_text: seed.enText },
      });

      const degreeCourseNames =
        degreeCourses[seed.university]?.[seed.enText] || [];

      for (const courseName of degreeCourseNames) {
        const courseTranslation = await prisma.translation.create({
          data: { en_text: courseName, he_text: courseName },
        });
        const block = await prisma.block.create({
          data: {},
        });
        await prisma.course.create({
          data: {
            translationId: courseTranslation.id,
            universityId: `u-${seed.id}`,
            blockId: block.id,
          },
        });
      }

      // connect degree translation manually so seed function finds it
      await prisma.translation.update({
        where: { id: degreeTranslation.id },
        data: {},
      });
    }

    const cache = new SeedCache();
    await seedDegrees(prisma, cache);

    const degrees = await prisma.degree.findMany({
      include: { courses: true },
    });
    expect(degrees.length).toBe(degreeSeeds.length);
    for (const degree of degrees) {
      expect(degree.courses.length).toBeGreaterThan(0);
    }
  });
});
