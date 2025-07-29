import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../generated/client';
import { PrismaService } from '../../src/prisma/prisma.service';
import { seed } from './seed';
import _ from 'lodash';

function replaceDates<T>(obj: T, hardcodedDate: Date): T {
  return _.cloneDeepWith(obj, (value: unknown) => {
    if (value instanceof Date) {
      return hardcodedDate as unknown as typeof value;
    }
    return undefined;
  }) as T;
}

vi.mock('../../generated/client', async () => {
  const actual = (await vi.importActual(
    '../../generated/client',
  )) as unknown as typeof client;
  return {
    ...actual,
    PrismaClient: createPrismock(actual.Prisma) as typeof actual.PrismaClient,
  };
});

let prisma: PrismaService;

beforeEach(() => {
  prisma = new PrismaService();
});

describe('seed snapshot', () => {
  it('saves seeded data snapshot', async () => {
    await seed(prisma);
    const data = (prisma as unknown as { getData(): unknown }).getData();
    expect(replaceDates(data, new Date(0))).toMatchSnapshot();
  });
});
