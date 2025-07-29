import { Prisma } from '../../generated/client'

/**
 * Cache for seed lookups.
 */
export class SeedCache {
  private readonly translations = new Map<string, Prisma.Translation>();
  private readonly universities = new Map<string, Prisma.University>();

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
  ): Promise<Prisma.Translation | undefined> {
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
  ): Promise<Prisma.University | undefined> {
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
