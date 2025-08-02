import { Prisma } from 'generated/client';
import { TRANSLATIONS } from './translations.consts';

/**
 * Seeds translations using bulk operations for optimal performance
 * @param tx - Prisma transaction client
 * @returns Promise<void>
 */
export const seedTranslations = async (
  tx: Prisma.TransactionClient,
): Promise<void> => {
  console.log(
    `🌱 Starting translations seeding (${TRANSLATIONS.length} items)...`,
  );

  const startTime = performance.now();

  try {
    // First check how many translations already exist
    const existingCount = await tx.translation.count();
    console.log(`📊 Found ${existingCount} existing translations`);

    // If we already have translations, check if we need to seed more
    if (existingCount > 0) {
      // Get all existing translation IDs
      const existingTranslations = await tx.translation.findMany({
        select: { id: true },
      });
      const existingIds = new Set(existingTranslations.map((t) => t.id));

      // Filter out translations that already exist
      const translationsToCreate = TRANSLATIONS.filter(
        (t) => !existingIds.has(t.id),
      );

      if (translationsToCreate.length === 0) {
        console.log('✅ All translations already exist, skipping seed');
        return;
      }

      console.log(
        `📊 Need to create ${translationsToCreate.length} new translations`,
      );

      // Use bulk createMany with skipDuplicates for remaining translations
      const result = await tx.translation.createMany({
        data: translationsToCreate,
        skipDuplicates: true,
      });

      const duration = performance.now() - startTime;
      console.log(
        `✅ Translations seeded successfully in ${Math.round(duration)}ms`,
      );
      console.log(
        `   📊 Created ${result.count} new translations out of ${translationsToCreate.length} attempted`,
      );
      console.log(
        `   📊 Total translations now: ${existingCount + result.count}`,
      );
    } else {
      // No existing translations, create all
      const result = await tx.translation.createMany({
        data: TRANSLATIONS,
        skipDuplicates: true,
      });

      const duration = performance.now() - startTime;
      console.log(
        `✅ Translations seeded successfully in ${Math.round(duration)}ms`,
      );
      console.log(
        `   📊 Created ${result.count} new translations out of ${TRANSLATIONS.length} total`,
      );
      console.log(`   📊 Total translations now: ${result.count}`);
    }
  } catch (error) {
    console.error('❌ Failed to seed translations:', error);
    throw error;
  }
};
