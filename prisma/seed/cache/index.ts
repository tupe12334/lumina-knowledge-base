import { Prisma, Translation, University } from '../../../generated/client';

/**
 * Cache for seed lookups.
 */
export class SeedCache {
  private readonly translations = new Map<string, Translation>();
  private readonly universities = new Map<string, University>();

  /**
   * Batch load translations to improve performance for multiple lookups.
   * This should be called at the beginning of seed functions that need multiple translations.
   *
   * @param tx - Prisma transaction client
   * @param enTexts - array of english texts to preload
   */
  async preloadTranslations(
    tx: Prisma.TransactionClient,
    enTexts: string[],
  ): Promise<void> {
    const missingTexts = enTexts.filter((text) => !this.translations.has(text));

    if (missingTexts.length === 0) {
      return; // All translations already cached
    }

    console.log(`🔄 Preloading ${missingTexts.length} translations...`);
    const startTime = performance.now();

    const translations = await tx.translation.findMany({
      where: { en_text: { in: missingTexts } },
    });

    // Cache all found translations
    translations.forEach((translation) => {
      this.translations.set(translation.en_text, translation);
    });

    const duration = performance.now() - startTime;
    console.log(
      `✅ Preloaded ${translations.length} translations in ${Math.round(duration)}ms`,
    );

    // Log any missing translations for debugging
    const foundTexts = new Set(translations.map((t) => t.en_text));
    const stillMissing = missingTexts.filter((text) => !foundTexts.has(text));
    if (stillMissing.length > 0) {
      console.warn(
        `⚠️  Missing translations for: ${stillMissing.slice(0, 3).join(', ')}${stillMissing.length > 3 ? ` and ${stillMissing.length - 3} more` : ''}`,
      );
    }
  }

  /**
   * Retrieve a translation by english text. Caches result for future calls.
   *
   * @param tx - Prisma transaction client
   * @param enText - english text of the translation
   * @returns cached translation or undefined if not found
   */
  async getTranslation(
    tx: Prisma.TransactionClient,
    enText: string,
  ): Promise<Translation | undefined> {
    if (!this.translations.has(enText)) {
      const translation = await tx.translation.findFirst({
        where: { en_text: enText },
      });
      if (translation) {
        this.translations.set(enText, translation);
      }
    }
    return this.translations.get(enText);
  }

  /**
   * Retrieve a university by its english name.
   * Uses translation cache to look up the university.
   *
   * @param tx - Prisma transaction client
   * @param enText - university english name
   * @returns cached university or undefined if not found
   */
  async getUniversity(
    tx: Prisma.TransactionClient,
    enText: string,
  ): Promise<University | undefined> {
    if (!this.universities.has(enText)) {
      const translation = await this.getTranslation(tx, enText);
      if (!translation) return undefined;
      const university = await tx.university.findFirst({
        where: { translationId: translation.id },
      });
      if (university) {
        this.universities.set(enText, university);
      }
    }
    return this.universities.get(enText);
  }
}
