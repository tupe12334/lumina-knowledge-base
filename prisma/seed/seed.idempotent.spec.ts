import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../generated/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { seed } from './seed';

vi.mock('../../generated/client', async () => {
  const actual = (await vi.importActual(
    '../../generated/client',
  )) as unknown as typeof client;
  return { ...actual, PrismaClient: createPrismock(actual.Prisma) };
});

let prisma: PrismaService;

beforeEach(() => {
  prisma = new PrismaService();
});

describe('seed idempotence', () => {
  it('can run seed multiple times without duplicates', async () => {
    console.log('Running seed for the first time...');
    await seed(prisma);
    console.log('Running seed for the second time...');
    await seed(prisma);
    const translations = await prisma.translation.findMany();
    const unique = new Set(translations.map((t) => t.en_text));
    console.log(`Found ${translations.length} translations.`);
    console.log(`Found ${unique.size} unique translations.`);

    if (unique.size !== translations.length) {
      const duplicates = translations.filter(
        (t, index, self) =>
          index !== self.findIndex((_t) => _t.en_text === t.en_text),
      );

      console.log('Duplicate translations found:', duplicates);
    }

    expect(unique.size).toBe(translations.length);
  });
});
