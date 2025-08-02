import { Prisma } from 'generated/client';
import { TRANSLATIONS } from './translations.consts';
import { withProgress } from './utils/progress-tracker';

/**
 * Seeds translations using bulk operations for optimal performance
 * @param tx - Prisma transaction client
 * @returns Promise<void>
 */
export const seedTranslations = async (
  tx: Prisma.TransactionClient,
): Promise<void> => {
  const { result, metrics } = await withProgress(
    'Translation Seeding',
    TRANSLATIONS.length,
    async (tracker) => {
      tracker.addNote('Checking existing translations...', 'info');

      // First check how many translations already exist
      const existingCount = await tx.translation.count();
      tracker.addNote(`Found ${existingCount} existing translations`, 'info');

      // If we already have translations, check if we need to seed more
      if (existingCount > 0) {
        tracker.addNote('Analyzing what needs to be created...', 'info');

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
          tracker.addNote(
            'All translations already exist, skipping',
            'success',
          );
          tracker.updateBatch(
            TRANSLATIONS.length,
            0,
            0,
            TRANSLATIONS.length,
            0,
          );
          return { created: 0, skipped: TRANSLATIONS.length };
        }

        tracker.addNote(
          `Creating ${translationsToCreate.length} new translations using bulk operations`,
          'info',
        );

        // Use bulk createMany with skipDuplicates for remaining translations
        const result = await tx.translation.createMany({
          data: translationsToCreate,
          skipDuplicates: true,
        });

        tracker.updateBatch(
          TRANSLATIONS.length,
          result.count,
          0,
          TRANSLATIONS.length - translationsToCreate.length,
          0,
        );

        tracker.addNote(
          `Created ${result.count} new translations, total now: ${existingCount + result.count}`,
          'success',
        );

        return {
          created: result.count,
          skipped: TRANSLATIONS.length - translationsToCreate.length,
        };
      } else {
        tracker.addNote(
          'No existing translations found, creating all translations',
          'info',
        );

        // No existing translations, create all
        const result = await tx.translation.createMany({
          data: TRANSLATIONS,
          skipDuplicates: true,
        });

        tracker.updateBatch(TRANSLATIONS.length, result.count, 0, 0, 0);

        tracker.addNote(
          `Created ${result.count} translations from scratch`,
          'success',
        );

        return { created: result.count, skipped: 0 };
      }
    },
    {
      showMemoryUsage: true,
      showDuration: true,
      logLevel: 'normal',
    },
  );

  console.log(
    `🎯 Translation seeding performance: ${((TRANSLATIONS.length / (metrics.endTime! - metrics.startTime)) * 1000).toFixed(0)} translations/second`,
  );
};
