import { Prisma } from '../../generated/client';
import { SeedCache } from './cache';
import {
  THE_COLLEGE_OF_MANAGEMENT_ACADEMIC_STUDIES_EN_NAME,
  THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
  TEL_AVIV_UNIVERSITY_EN_NAME,
} from './universities.consts';
import { degreeCourses } from './degrees.consts.seed';

interface DegreeSeed {
  id: string;
  enText: string;
  university: string;
}

export const degreeSeeds: DegreeSeed[] = [
  {
    id: '17004398-f4fe-4658-a023-f79283bf22de',
    enText: 'Economics',
    university: THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
  },
  {
    id: '8c6a661a-a1f0-4922-82dd-45b4938b3887',
    enText: 'Psychology',
    university: THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
  },
  {
    id: 'fa8a5dc5-8368-4f13-97f7-83cd9f701013',
    enText: 'Cognitive Science',
    university: THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
  },
  {
    id: '43eae81a-0c42-4e5c-894d-bd803334f0cd',
    enText: 'Mathematics',
    university: THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
  },
  {
    id: '73ef0be5-bd20-4181-aa70-52cf19ac5a9c',
    enText: 'Computer Science',
    university: THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
  },
  {
    id: 'c7a1e2b2-8e2d-4c1a-9e2a-1a2b3c4d5e6f',
    enText: 'Computer Science',
    university: THE_COLLEGE_OF_MANAGEMENT_ACADEMIC_STUDIES_EN_NAME,
  },
  {
    id: 'fe63f747-f7c8-4c63-bb5b-904f503cd23e',
    enText: 'Electrical Engineering',
    university: TEL_AVIV_UNIVERSITY_EN_NAME,
  },
];

export async function seedDegrees(
  prisma: Prisma.TransactionClient,
  cache: SeedCache,
) {
  console.log(`Starting to seed ${degreeSeeds.length} degrees...`);

  for (const seed of degreeSeeds) {
    console.log(
      `\n--- Processing degree: ${seed.enText} at ${seed.university} ---`,
    );

    const degreeTranslation = await cache.getTranslation(prisma, seed.enText);
    if (!degreeTranslation) {
      throw new Error(
        `Translation for degree '${seed.enText}' not found. Seed translations first.`,
      );
    }
    console.log(`✓ Found degree translation: ${degreeTranslation.id}`);

    const universityTranslation = await cache.getTranslation(
      prisma,
      seed.university,
    );
    if (!universityTranslation) {
      throw new Error(
        `Translation for university '${seed.university}' not found. Seed translations first.`,
      );
    }
    console.log(`✓ Found university translation: ${universityTranslation.id}`);

    const university = await cache.getUniversity(prisma, seed.university);
    if (!university) {
      throw new Error(
        `University '${seed.university}' not found. Seed universities first.`,
      );
    }
    console.log(`✓ Found university: ${university.id}`);

    let degree = await prisma.degree.findFirst({
      where: {
        translationId: degreeTranslation.id,
        universityId: university.id,
      },
    });

    if (!degree) {
      degree = await prisma.degree.create({
        data: {
          id: seed.id,
          translationId: degreeTranslation.id,
          universityId: university.id,
        },
      });
      console.log(`✓ Created degree '${seed.enText}' with ID: ${degree.id}`);
    } else {
      console.log(
        `✓ Found existing degree '${seed.enText}' with ID: ${degree.id}`,
      );
    }

    // Process courses for this degree
    console.log(`\n--- Processing courses for degree: ${seed.enText} ---`);

    let courses: string[] = [];
    const universityCourses = degreeCourses[seed.university];
    console.log(
      `Available universities in degreeCourses:`,
      Object.keys(degreeCourses),
    );
    console.log(`Looking for university: "${seed.university}"`);
    console.log(`Found university courses:`, universityCourses);

    if (
      universityCourses &&
      typeof universityCourses === 'object' &&
      typeof seed.enText === 'string' &&
      Object.prototype.hasOwnProperty.call(universityCourses, seed.enText)
    ) {
      console.log(
        `Available degrees for ${seed.university}:`,
        Object.keys(universityCourses),
      );
      console.log(`Looking for degree: "${seed.enText}"`);

      const maybeCourses = (universityCourses as Record<string, unknown>)[
        seed.enText
      ];
      console.log(`Found courses data:`, maybeCourses);

      if (Array.isArray(maybeCourses)) {
        courses = maybeCourses as string[];
        console.log(
          `✓ Found ${courses.length} courses for degree '${seed.enText}':`,
          courses,
        );
      } else {
        console.log(
          `⚠ Courses data is not an array for degree '${seed.enText}':`,
          typeof maybeCourses,
        );
      }
    } else {
      console.log(`⚠ University or degree not found in degreeCourses`);
      console.log(`University check:`, !!universityCourses);
      console.log(`University type:`, typeof universityCourses);
      console.log(`Degree text type:`, typeof seed.enText);
      console.log(
        `Has property:`,
        universityCourses
          ? Object.prototype.hasOwnProperty.call(universityCourses, seed.enText)
          : false,
      );
    }

    if (courses.length > 0) {
      console.log(`Processing ${courses.length} courses...`);
      let connectedCount = 0;
      let skippedCount = 0;

      for (const courseName of courses) {
        console.log(`  Checking course: "${courseName}"`);

        const courseTranslation = await cache.getTranslation(
          prisma,
          courseName,
        );
        if (!courseTranslation) {
          console.warn(
            `  ⚠ Translation for course '${courseName}' not found. Seed translations first.`,
          );
          skippedCount++;
          continue;
        }
        console.log(`    ✓ Found course translation: ${courseTranslation.id}`);

        const course = await prisma.course.findFirst({
          where: {
            translationId: courseTranslation.id,
            universityId: university.id,
          },
        });
        if (!course) {
          console.warn(
            `  ⚠ Course '${courseName}' not found for university '${seed.university}'. Seed courses first.`,
          );
          skippedCount++;
          continue;
        }
        console.log(`    ✓ Found course: ${course.id}`);

        // Ensure a Block exists for the course
        let block = await prisma.block.findFirst({
          where: { id: course.blockId },
        });
        if (!block) {
          console.log(`    Creating missing block for course ${course.id}`);
          block = await prisma.block.create({
            data: {
              id: course.blockId,
            },
          });
        }
        console.log(`    ✓ Block exists: ${block.id}`);

        // Connect course to degree if not already connected
        const existingConnection = await prisma.course.findFirst({
          where: {
            id: course.id,
            Degree: { some: { id: degree.id } },
          },
        });

        if (!existingConnection) {
          await prisma.course.update({
            where: { id: course.id },
            data: {
              Degree: { connect: { id: degree.id } },
            },
          });
          console.log(
            `    ✓ Connected course '${courseName}' to degree '${seed.enText}'.`,
          );
          connectedCount++;
        } else {
          console.log(
            `    ✓ Course '${courseName}' already connected to degree '${seed.enText}'.`,
          );
          connectedCount++;
        }
      }

      console.log(`\n✓ Degree '${seed.enText}' summary:`);
      console.log(`  - Connected courses: ${connectedCount}`);
      console.log(`  - Skipped courses: ${skippedCount}`);
      console.log(`  - Total courses processed: ${courses.length}`);
    } else {
      console.log(
        `⚠ No courses found for degree '${seed.enText}' at '${seed.university}'`,
      );
    }
  }

  console.log(`\n=== Degree seeding completed ===`);
}
