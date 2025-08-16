import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HealthController } from './health.controller';
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/prisma/prisma.service';
import { DbRowsHealthIndicator } from './db-rows.indicator';

interface MockPrismaHealth {
  pingCheck: ReturnType<typeof vi.fn>;
}

interface MockMemoryHealth {
  checkHeap: ReturnType<typeof vi.fn>;
  checkRSS: ReturnType<typeof vi.fn>;
}

interface MockDiskHealth {
  checkStorage: ReturnType<typeof vi.fn>;
}

interface MockDbRows {
  isHealthy: ReturnType<typeof vi.fn>;
}

interface MockHealthService {
  check: ReturnType<typeof vi.fn>;
}

describe('HealthController', () => {
  let controller: HealthController;
  const prisma = {} as unknown as PrismaService;

  let prismaHealth: MockPrismaHealth;
  let memoryHealth: MockMemoryHealth;
  let diskHealth: MockDiskHealth;
  let dbRows: MockDbRows;
  let health: MockHealthService;

  beforeEach(() => {
    prismaHealth = { pingCheck: vi.fn() };
    memoryHealth = { checkHeap: vi.fn(), checkRSS: vi.fn() };
    diskHealth = { checkStorage: vi.fn() };
    dbRows = { isHealthy: vi.fn() };
    health = {
      check: vi.fn(
        async (fns: Array<() => Promise<Record<string, unknown>>>) => {
          const merged: Record<string, unknown> = {};
          for (const fn of fns) {
            Object.assign(merged, await fn());
          }
          return merged;
        },
      ),
    };

    prismaHealth.pingCheck.mockResolvedValue({ database: { status: 'up' } });
    dbRows.isHealthy.mockResolvedValue({ db_rows: { status: 'up' } });
    memoryHealth.checkHeap.mockResolvedValue({ memory_heap: { status: 'up' } });
    memoryHealth.checkRSS.mockResolvedValue({ memory_rss: { status: 'up' } });
    diskHealth.checkStorage.mockResolvedValue({ storage: { status: 'up' } });

    controller = new HealthController(
      health as unknown as HealthCheckService,
      prismaHealth as unknown as PrismaHealthIndicator,
      memoryHealth as unknown as MemoryHealthIndicator,
      diskHealth as unknown as DiskHealthIndicator,
      prisma,
      dbRows as unknown as DbRowsHealthIndicator,
    );
  });

  it('GET /health should check db, rows, and memory with default thresholds', async () => {
    const res = await controller.check();
    expect(res).toMatchObject({ database: { status: 'up' } });
    expect(res).toMatchObject({ db_rows: { status: 'up' } });

    expect(prismaHealth.pingCheck).toHaveBeenCalledWith('database', prisma);
    expect(dbRows.isHealthy).toHaveBeenCalledWith('db_rows', 100);
    expect(memoryHealth.checkHeap).toHaveBeenCalledWith(
      'memory_heap',
      150 * 1024 * 1024,
    );
    expect(memoryHealth.checkRSS).toHaveBeenCalledWith(
      'memory_rss',
      150 * 1024 * 1024,
    );
  });

  it('GET /health/liveness should check memory with higher thresholds', async () => {
    await controller.liveness();
    expect(memoryHealth.checkHeap).toHaveBeenCalledWith(
      'memory_heap',
      300 * 1024 * 1024,
    );
    expect(memoryHealth.checkRSS).toHaveBeenCalledWith(
      'memory_rss',
      300 * 1024 * 1024,
    );
  });

  it('GET /health/readiness should check db, rows, and disk storage', async () => {
    await controller.readiness();
    expect(prismaHealth.pingCheck).toHaveBeenCalledWith('database', prisma);
    expect(dbRows.isHealthy).toHaveBeenCalledWith('db_rows', 100);
    expect(diskHealth.checkStorage).toHaveBeenCalledWith('storage', {
      thresholdPercent: 0.95,
      path: '/',
    });
  });
});
