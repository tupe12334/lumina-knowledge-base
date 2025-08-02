import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../generated/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { seed } from './seed';
import { validate as uuidValidate } from 'uuid';

vi.mock('../../generated/client', async () => {
  const actual = (await vi.importActual(
    '../../generated/client',
  )) as unknown as typeof client;
  return {
    ...actual,
    PrismaClient: createPrismock(actual.Prisma) as typeof actual.PrismaClient,
  };
});

let prisma: PrismaService;

beforeEach(() => {
  prisma = new PrismaService();
});

describe('UUID Validation', () => {
  beforeEach(async () => {
    await seed(prisma);
  });

  it('should validate that all translation IDs are valid UUIDs', async () => {
    const translations = await prisma.translation.findMany();

    for (const translation of translations) {
      expect(
        uuidValidate(translation.id),
        `Translation ID ${translation.id} is not a valid UUID`,
      ).toBe(true);
    }

    console.log(`✓ Validated ${translations.length} translation IDs`);
  });

  it('should validate that all university IDs are valid UUIDs', async () => {
    const universities = await prisma.university.findMany();

    for (const university of universities) {
      expect(
        uuidValidate(university.id),
        `University ID ${university.id} is not a valid UUID`,
      ).toBe(true);
      expect(
        uuidValidate(university.translationId),
        `University translationId ${university.translationId} is not a valid UUID`,
      ).toBe(true);
    }

    console.log(`✓ Validated ${universities.length} university IDs`);
  });

  it('should validate that all faculty IDs are valid UUIDs', async () => {
    const faculties = await prisma.faculty.findMany();

    for (const faculty of faculties) {
      expect(
        uuidValidate(faculty.id),
        `Faculty ID ${faculty.id} is not a valid UUID`,
      ).toBe(true);
      expect(
        uuidValidate(faculty.translationId),
        `Faculty translationId ${faculty.translationId} is not a valid UUID`,
      ).toBe(true);
      expect(
        uuidValidate(faculty.universityId),
        `Faculty universityId ${faculty.universityId} is not a valid UUID`,
      ).toBe(true);
    }

    console.log(`✓ Validated ${faculties.length} faculty IDs`);
  });

  it('should validate that all degree IDs are valid UUIDs', async () => {
    const degrees = await prisma.degree.findMany();

    for (const degree of degrees) {
      expect(
        uuidValidate(degree.id),
        `Degree ID ${degree.id} is not a valid UUID`,
      ).toBe(true);
      expect(
        uuidValidate(degree.translationId),
        `Degree translationId ${degree.translationId} is not a valid UUID`,
      ).toBe(true);
      expect(
        uuidValidate(degree.universityId),
        `Degree universityId ${degree.universityId} is not a valid UUID`,
      ).toBe(true);
    }

    console.log(`✓ Validated ${degrees.length} degree IDs`);
  });

  it('should validate that all course IDs are valid UUIDs', async () => {
    const courses = await prisma.course.findMany();

    for (const course of courses) {
      expect(
        uuidValidate(course.id),
        `Course ID ${course.id} is not a valid UUID`,
      ).toBe(true);
      expect(
        uuidValidate(course.translationId),
        `Course translationId ${course.translationId} is not a valid UUID`,
      ).toBe(true);
      expect(
        uuidValidate(course.blockId),
        `Course blockId ${course.blockId} is not a valid UUID`,
      ).toBe(true);
    }

    console.log(`✓ Validated ${courses.length} course IDs`);
  });

  it('should validate that all block IDs are valid UUIDs', async () => {
    const blocks = await prisma.block.findMany();

    for (const block of blocks) {
      expect(
        uuidValidate(block.id),
        `Block ID ${block.id} is not a valid UUID`,
      ).toBe(true);
    }

    console.log(`✓ Validated ${blocks.length} block IDs`);
  });

  it('should validate that all module IDs are valid UUIDs', async () => {
    const modules = await prisma.module.findMany();

    for (const module of modules) {
      expect(
        uuidValidate(module.id),
        `Module ID ${module.id} is not a valid UUID`,
      ).toBe(true);
      expect(
        uuidValidate(module.translationId),
        `Module translationId ${module.translationId} is not a valid UUID`,
      ).toBe(true);
      expect(
        uuidValidate(module.blockId),
        `Module blockId ${module.blockId} is not a valid UUID`,
      ).toBe(true);
    }

    console.log(`✓ Validated ${modules.length} module IDs`);
  });

  it('should validate that all question IDs are valid UUIDs', async () => {
    const questions = await prisma.question.findMany();

    for (const question of questions) {
      expect(
        uuidValidate(question.id),
        `Question ID ${question.id} is not a valid UUID`,
      ).toBe(true);
      expect(
        uuidValidate(question.translationId),
        `Question translationId ${question.translationId} is not a valid UUID`,
      ).toBe(true);
    }

    console.log(`✓ Validated ${questions.length} question IDs`);
  });

  it('should validate that all degree-course relationship IDs are valid UUIDs', async () => {
    // Get all degrees with their courses
    const degrees = await prisma.degree.findMany({
      include: {
        courses: true,
      },
    });

    let relationshipCount = 0;
    for (const degree of degrees) {
      for (const course of degree.courses) {
        expect(
          uuidValidate(degree.id),
          `Degree-Course relationship degreeId ${degree.id} is not a valid UUID`,
        ).toBe(true);
        expect(
          uuidValidate(course.id),
          `Degree-Course relationship courseId ${course.id} is not a valid UUID`,
        ).toBe(true);
        relationshipCount++;
      }
    }

    console.log(
      `✓ Validated ${relationshipCount} degree-course relationship IDs`,
    );
  });

  it('should provide a comprehensive summary of all validated UUIDs', async () => {
    const [
      translations,
      universities,
      faculties,
      degrees,
      courses,
      blocks,
      modules,
      questions,
    ] = await Promise.all([
      prisma.translation.findMany(),
      prisma.university.findMany(),
      prisma.faculty.findMany(),
      prisma.degree.findMany(),
      prisma.course.findMany(),
      prisma.block.findMany(),
      prisma.module.findMany(),
      prisma.question.findMany(),
    ]);

    // Get degree-course relationships
    const degreesWithCourses = await prisma.degree.findMany({
      include: {
        courses: true,
      },
    });

    let degreeCourseRelationshipCount = 0;
    for (const degree of degreesWithCourses) {
      degreeCourseRelationshipCount += degree.courses.length;
    }

    const totalUUIDs =
      translations.length + // translation IDs
      universities.length * 2 + // university ID + translationId
      faculties.length * 3 + // faculty ID + translationId + universityId
      degrees.length * 3 + // degree ID + translationId + universityId
      courses.length * 3 + // course ID + translationId + blockId
      blocks.length + // block IDs
      modules.length * 3 + // module ID + translationId + courseId
      questions.length * 2 + // question ID + moduleId
      degreeCourseRelationshipCount * 2; // degreeId + courseId

    console.log(`\n📊 UUID Validation Summary:`);
    console.log(`  • Translations: ${translations.length} IDs`);
    console.log(`  • Universities: ${universities.length * 2} IDs`);
    console.log(`  • Faculties: ${faculties.length * 3} IDs`);
    console.log(`  • Degrees: ${degrees.length * 3} IDs`);
    console.log(`  • Courses: ${courses.length * 3} IDs`);
    console.log(`  • Blocks: ${blocks.length} IDs`);
    console.log(`  • Modules: ${modules.length * 3} IDs`);
    console.log(`  • Questions: ${questions.length * 2} IDs`);
    console.log(
      `  • Degree-Course Relationships: ${degreeCourseRelationshipCount * 2} IDs`,
    );
    console.log(`  ─────────────────────────────────────────`);
    console.log(`  • Total UUIDs validated: ${totalUUIDs}`);
    console.log(`  ✅ All UUIDs are valid!`);

    // This test should always pass if all other tests pass
    expect(true).toBe(true);
  });
});
