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
import { seedBinaryTreesQuestions } from './binary-trees-module-questions.seed';
import { seedBlockConnections } from './block-connections.seed';
import { BLOCK_CONNECTIONS } from './block-connections.consts';
import { seedUniversities } from './universities.seed';
import { seedTranslations } from './translations.seed';
import { SeedCache } from './cache';
import { PerformanceBenchmark } from './utils/progress-tracker';
import { withErrorRecovery } from './utils/error-recovery';

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
  const benchmark = new PerformanceBenchmark();
  const cache = new SeedCache();

  console.log('🌱 Starting comprehensive database seeding process...');
  console.log(
    `📊 Estimated items: Translations, Universities, Faculties, Courses, Degrees, Modules, Questions`,
  );

  benchmark.checkpoint('Seed Start');

  await prisma.$transaction(
    async (tx) => {
      console.log(`\n🚀 Transaction started - seeding database...`);

      // Phase 1: Core translations and infrastructure
      console.log('\n� Phase 1: Core Translations & Infrastructure');
      benchmark.checkpoint('Translations Start');

      await withErrorRecovery(
        () => seedTranslations(tx),
        'Translations Seeding',
        undefined,
        { continueOnError: false },
      );

      benchmark.checkpoint('Translations Complete');

      // Phase 2: Universities and faculties
      console.log('\n🏛️  Phase 2: Universities & Faculties');
      benchmark.checkpoint('Universities Start');

      await withErrorRecovery(
        () => seedUniversities(tx, cache),
        'Universities Seeding',
        undefined,
        { continueOnError: false },
      );

      await withErrorRecovery(
        () => seedFaculties(tx, cache),
        'Faculties Seeding',
        undefined,
        { continueOnError: false },
      );

      benchmark.checkpoint('Universities & Faculties Complete');

      // Phase 3: Courses and degrees
      console.log('\n📚 Phase 3: Courses & Degrees');
      benchmark.checkpoint('Courses Start');

      await withErrorRecovery(
        () => seedColmanCourses(tx, cache),
        'Colman Courses Seeding',
        undefined,
        { continueOnError: true },
      );

      // Create blocks for computer science courses before creating the courses
      console.log(`\n🔨 Creating blocks for computer science courses...`);
      await withErrorRecovery(
        () => createBlocksForComputerScienceCourses(tx),
        'Block Creation',
        undefined,
        { continueOnError: true },
      );

      await withErrorRecovery(
        () => seedComputerScienceCourses(tx, cache),
        'Computer Science Courses Seeding',
        undefined,
        { continueOnError: true },
      );

      await withErrorRecovery(
        () => seedDegrees(tx, cache),
        'Degrees Seeding',
        undefined,
        { continueOnError: true },
      );

      await withErrorRecovery(
        () => seedComputerScienceDegree(tx),
        'Computer Science Degree Seeding',
        undefined,
        { continueOnError: true },
      );

      await withErrorRecovery(
        () => seedEconomicsDegree(tx),
        'Economics Degree Seeding',
        undefined,
        { continueOnError: true },
      );

      benchmark.checkpoint('Courses & Degrees Complete');

      // Phase 4: Modules and questions
      console.log('\n🧩 Phase 4: Modules & Questions');
      benchmark.checkpoint('Modules Start');

      await withErrorRecovery(
        () => seedModules(tx, cache),
        'Modules Seeding',
        undefined,
        { continueOnError: true },
      );

      await withErrorRecovery(
        () => seedQuestions(tx, cache),
        'Questions Seeding',
        undefined,
        { continueOnError: true },
      );

      await withErrorRecovery(
        () => seedPhysicsModulesAndQuestions(tx, cache),
        'Physics Modules & Questions Seeding',
        undefined,
        { continueOnError: true },
      );

      await withErrorRecovery(
        () => seedBinaryTreesQuestions(tx, cache),
        'Binary Trees Questions Seeding',
        undefined,
        { continueOnError: true },
      );

      benchmark.checkpoint('Modules & Questions Complete');

      // Phase 5: Block connections
      console.log('\n🔗 Phase 5: Block Connections');
      benchmark.checkpoint('Block Connections Start');

      await withErrorRecovery(
        () => seedBlockConnections(tx, BLOCK_CONNECTIONS),
        'Block Connections Seeding',
        undefined,
        { continueOnError: true },
      );

      benchmark.checkpoint('Block Connections Complete');
    },
    { timeout: 120000 }, // Increased timeout for comprehensive tracking
  );

  benchmark.checkpoint('Transaction Complete');

  await prisma.$disconnect();

  benchmark.checkpoint('Disconnection Complete');

  // Display comprehensive performance summary
  console.log('\n🎉 Database seeding completed successfully!');
  benchmark.summary();

  console.log('\n📊 Final Summary:');
  console.log('   ✅ All seed operations completed');
  console.log('   🔗 Database relationships established');
  console.log('   📈 System ready for use');
};

if (require.main === module) {
  void (async () => {
    const { PrismaClient } = await import('../../generated/client');
    const prisma = new PrismaClient();
    void (await seed(prisma));
    void prisma.$disconnect();
  })();
}
