import { Prisma } from '../../generated/client';
import { courses } from './courses.consts';
import { SeedCache } from './cache';

export const seedComputerScienceCourses = async (
  tx: Prisma.TransactionClient,
  cache: SeedCache,
) => {
  const translationIds: Record<string, string> = {};
  for (const courseData of courses) {
    const existing = await cache.getTranslation(tx, courseData.en_name);
    const translation = existing
      ? await tx.translation.update({
          where: { id: existing.id },
          data: { he_text: courseData.he_name },
        })
      : await tx.translation.create({
          data: {
            id: courseData.translationId,
            en_text: courseData.en_name,
            he_text: courseData.he_name,
          },
        });
    translationIds[courseData.id] = translation.id;
  }

  // Then create the courses
  for (const courseData of courses) {
    await tx.course.upsert({
      where: {
        id: courseData.id,
      },
      update: {
        blockId: courseData.blockId,
      },
      create: {
        id: courseData.id,
        name: {
          connect: { id: translationIds[courseData.id] },
        },
        university: {
          connect: { id: courseData.universityId },
        },
        Block: {
          connect: { id: courseData.blockId },
        },
      },
    });
  }

  console.log(
    `Created ${courses.length} computer science courses with their translations.`,
  );
};
