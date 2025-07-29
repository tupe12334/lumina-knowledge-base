import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../../generated/client';
import { ModulesService } from './modules.service';
import { PrismaService } from '../../prisma/prisma.service';

vi.mock('../../../generated/client', async () => {
  const actual = (await vi.importActual(
    '../../../generated/client',
  )) as unknown as typeof client;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return { ...actual, PrismaClient: createPrismock(actual.Prisma) };
});

let prisma: PrismaService;
let service: ModulesService;

beforeEach(() => {
  prisma = new PrismaService();
  service = new ModulesService(prisma);
});

describe('ModulesService', () => {
  it('returns module from prisma', async () => {
    const name1 = await prisma.translation.create({
      data: { en_text: 'module', he_text: 'מודול' },
    });
    const name2 = await prisma.translation.create({
      data: { en_text: 'sub', he_text: 'תת' },
    });

    await prisma.module.create({
      data: { id: 'sub1', translationId: name2.id },
    });
    await prisma.module.create({
      data: {
        id: 'm1',
        translationId: name1.id,
        subModules: { connect: { id: 'sub1' } },
      },
    });

    const result = await service.findUnique('m1');

    expect(result).toEqual({
      id: 'm1',
      name: { en_text: 'module', he_text: 'מודול' },
      subModules: [
        { id: 'sub1', name: { en_text: 'sub', he_text: 'תת' }, subModules: [] },
      ],
      parentModules: [],
      prerequisites: [],
      postrequisites: [],
    });
  });
});
