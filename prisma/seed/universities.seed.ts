import { Prisma } from '../../generated/client';
import { UNIVERSITIES } from './universities.consts';
import { SeedCache } from './cache';

export async function seedUniversities(
  tx: Prisma.TransactionClient,
  cache: SeedCache,
) {
  for (const uni of Object.values(UNIVERSITIES)) {
    const translation = await cache.getTranslation(tx, uni.en_text);
    if (!translation) {
      console.warn(`Translation not found for university: ${uni.en_text}`);
      continue;
    }
    const existing = await tx.university.findFirst({
      where: { translationId: translation.id },
    });
    if (existing) {
      continue;
    }
    await tx.university.create({
      data: {
        id: uni.id,
        translationId: translation.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
  console.log('Universities seeded successfully.');
}
