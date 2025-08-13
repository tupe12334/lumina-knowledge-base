import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../../generated/client';
import { BlocksService } from './blocks.service';
import { PrismaService } from '../../prisma/prisma.service';

vi.mock('@prisma/client', async () => {
  const actual = (await vi.importActual(
    '@prisma/client',
  )) as unknown as typeof client;

  return { ...actual, PrismaClient: createPrismock(actual.Prisma) };
});

let prisma: PrismaService;
let service: BlocksService;

beforeEach(() => {
  prisma = new PrismaService();
  service = new BlocksService(prisma);
});

describe('BlocksService', () => {
  it('returns block from prisma', async () => {
    const moduleName = await prisma.translation.create({
      data: { en_text: 'Module', he_text: 'מודול' },
    });

    const block = await prisma.block.create({ data: { id: 'b1' } });
    await prisma.block.create({ data: { id: 'b2' } });
    await prisma.block.update({
      where: { id: 'b1' },
      data: { postrequisiteOf: { connect: { id: 'b2' } } },
    });

    await prisma.module.create({
      data: { id: 'm1', translationId: moduleName.id, blockId: block.id },
    });

    const result = await service.findUnique('b1');

    expect(result).toBeDefined();
    expect(result?.id).toBe('b1');
    // Module is the actual property name from Prisma (capital M)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect((result as any)?.Module).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect((result as any)?.Module?.[0]?.id).toBe('m1');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect((result as any)?.Module?.[0]?.name?.en_text).toBe('Module');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect((result as any)?.Module?.[0]?.name?.he_text).toBe('מודול');
    expect(result?.prerequisiteFor).toEqual([]);
    expect(result?.postrequisiteOf).toEqual([]);
  });
});
