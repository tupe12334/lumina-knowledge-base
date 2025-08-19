import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DataHashService,
  PrismaQueryable,
} from 'src/system/data-hash/data-hash.service';

class FakePrisma implements PrismaQueryable {
  _queryRaw = vi.fn(() => Promise.resolve([] as unknown));
  _queryRawUnsafe = vi.fn(() => Promise.resolve([] as unknown));

  $queryRaw<T = unknown>(...args: unknown[]): Promise<T> {
    return this._queryRaw.apply(null, args) as Promise<T>;
  }
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...params: unknown[]
  ): Promise<T> {
    return this._queryRawUnsafe.apply(null, [query, ...params]) as Promise<T>;
  }
}

describe('DataHashService', () => {
  let prisma: FakePrisma;
  let service: DataHashService;

  beforeEach(() => {
    prisma = new FakePrisma();
    service = new DataHashService(prisma);
  });

  it('hashes records deterministically across tables', async () => {
    prisma._queryRaw.mockResolvedValueOnce([{ name: 'A' }, { name: 'B' }]);
    prisma._queryRawUnsafe
      .mockResolvedValueOnce([{ id: '1', value: 2 }])
      .mockResolvedValueOnce([
        { id: '1', title: 'x' },
        { id: '2', title: 'y' },
      ]);

    const hash1 = await service.computeDatabaseHashPublic();

    // Re-run with same data order to ensure determinism
    prisma._queryRaw.mockResolvedValueOnce([{ name: 'A' }, { name: 'B' }]);
    prisma._queryRawUnsafe
      .mockResolvedValueOnce([{ id: '1', value: 2 }])
      .mockResolvedValueOnce([
        { id: '1', title: 'x' },
        { id: '2', title: 'y' },
      ]);
    const hash2 = await service.computeDatabaseHashPublic();

    expect(hash1).toEqual(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });
});
