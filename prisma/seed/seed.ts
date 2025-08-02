import { Prisma, PrismaClient } from 'generated/client';
import { seedColmanCourses } from './colman.courses.seed';
import { seedComputerScienceDegree } from './computer-science-degree.seed';
import { seedComputerScienceCourses } from './computer-science.seed';
import { courses } from './courses.consts';
import { seedDegrees } from './degree.seed';
import { seedEconomicsDegree } from './economics-degree.seed';
import { seedFaculties } from './faculties.seed';
import { seedModules } from './modules.seed';
import { seedPhysicsModulesAndQuestions } from './physics-modules-questions.seed';
import { seedQuestions } from './questions.seed';
import { seedBlockConnections } from './block-connections.seed';
import { BLOCK_CONNECTIONS } from './block-connections.consts';
import { seedUniversities } from './universities.seed';
import { seedTranslations } from './translations.seed';
import { SeedCache } from './cache';

const createBlocksForComputerScienceCourses = async (
  tx: Prisma.TransactionClient,
) => {
  const uniqueBlockIds = [...new Set(courses.map((course) => course.blockId))];

  for (const blockId of uniqueBlockIds) {
    await tx.block.upsert({
      where: { id: blockId },
      update: {},
      create: {
        id: blockId,
      },
    });
  }
  console.log(
    `Created ${uniqueBlockIds.length} blocks for computer science courses.`,
  );
};

export const seed = async (prisma: PrismaClient) => {
  const cache = new SeedCache();
  await prisma.$transaction(
    async (tx) => {
      console.log(`Seeding database...`);

      // Seed translations using optimized bulk operations
      console.log('🚀 About to seed translations...');
      await seedTranslations(tx);
      console.log('✅ Finished seeding translations');

      await seedUniversities(tx, cache);
      await seedFaculties(tx, cache);
      await seedColmanCourses(tx, cache);

      // Create blocks for computer science courses before creating the courses
      console.log(`Creating blocks for computer science courses...`);
      await createBlocksForComputerScienceCourses(tx);

      await seedComputerScienceCourses(tx, cache);
      await seedDegrees(tx, cache);
      await seedComputerScienceDegree(tx);
      await seedEconomicsDegree(tx);
      await seedModules(tx, cache);
      await seedQuestions(tx, cache);
      await seedPhysicsModulesAndQuestions(tx, cache);
      await seedBlockConnections(tx, BLOCK_CONNECTIONS);
    },
    { timeout: 100000 },
  );
  await prisma.$disconnect();
};

if (require.main === module) {
  void (async () => {
    const { PrismaClient } = await import('../../generated/client');
    const prisma = new PrismaClient();
    void (await seed(prisma));
    void prisma.$disconnect();
  })();
}
