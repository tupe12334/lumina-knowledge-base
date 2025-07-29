import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../../generated/client';
import { BlocksService } from './blocks.service';
import { PrismaService } from '../../prisma/prisma.service';

vi.mock('@prisma/client', async () => {
  const actual = (await vi.importActual(
    '@prisma/client',
  )) as unknown as typeof client;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

    expect(result).toEqual({
      id: 'b1',
      createdAt: expect.any(Date),
      updatedAt: null,
      Module: [{
        id: 'm1',
        createdAt: expect.any(Date),
        updatedAt: null,
        translationId: moduleName.id,
        blockId: 'b1',
        name: { 
          id: moduleName.id,
          createdAt: expect.any(Date),
          updatedAt: null,
          en_text: 'Module', 
          he_text: 'מודול' 
        }
      }],
      prerequisiteFor: [],
      postrequisiteOf: []
    });
  });
});
