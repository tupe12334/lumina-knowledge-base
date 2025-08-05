import { describe, it, expect, beforeEach } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../../generated/client';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { SeedCache } from './index';

vi.mock('../../../generated/client', async () => {
  const actual = (await vi.importActual(
    '../../../generated/client',
  )) as unknown as typeof client;
  return { ...actual, PrismaClient: createPrismock(actual.Prisma) };
});

let prisma: PrismaService;
let cache: SeedCache;

beforeEach(() => {
  prisma = new PrismaService();
  cache = new SeedCache();
});

describe('SeedCache', () => {
  it('returns cached translation without hitting database again', async () => {
    const t = await prisma.translation.create({
      data: { en_text: 't', he_text: 't' },
    });

    const first = await cache.getTranslation(prisma, 't');
    await prisma.translation.delete({ where: { id: t.id } });
    const second = await cache.getTranslation(prisma, 't');

    expect(first).toEqual(second);
  });

  it('returns cached university', async () => {
    const translation = await prisma.translation.create({
      data: { en_text: 'u', he_text: 'u' },
    });
    const uni = await prisma.university.create({
      data: {
        id: 'u1',
        translationId: translation.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const first = await cache.getUniversity(prisma, 'u');
    await prisma.university.delete({ where: { id: uni.id } });
    const second = await cache.getUniversity(prisma, 'u');

    expect(first).toEqual(second);
  });
});
