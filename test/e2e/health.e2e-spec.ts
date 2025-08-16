import 'reflect-metadata';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { HealthController } from 'src/system/health/health.controller';
import { DbRowsHealthIndicator } from 'src/system/health/db-rows.indicator';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import type { Server } from 'http';
import { z } from 'zod';

const isHttpServer = (value: unknown): value is Server => {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as Partial<Server>).listen === 'function'
  );
};

describe('Health E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Build a minimal module with HealthController and stubbed dependencies
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            // Terminus HealthCheckService compatible stub
            check: (fns: Array<() => Promise<Record<string, unknown>>>) =>
              Promise.resolve().then(async () => {
                const info: Record<string, unknown> = {};
                for (const fn of fns) {
                  Object.assign(info, await fn());
                }
                return { status: 'ok', info };
              }),
          },
        },
        { provide: PrismaService, useValue: {} },
        {
          provide: PrismaHealthIndicator,
          useValue: {
            pingCheck: () => Promise.resolve({ database: { status: 'up' } }),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: () => Promise.resolve({ memory_heap: { status: 'up' } }),
            checkRSS: () => Promise.resolve({ memory_rss: { status: 'up' } }),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: {
            checkStorage: () => Promise.resolve({ storage: { status: 'up' } }),
          },
        },
        {
          provide: DbRowsHealthIndicator,
          useValue: {
            isHealthy: () =>
              Promise.resolve({
                db_rows: { status: 'up', totalRows: 9999 },
              }),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /health returns ok with expected indicators', async () => {
    const unknownServer: unknown = app.getHttpServer();
    if (!isHttpServer(unknownServer)) {
      throw new Error('HTTP server not started');
    }
    const res = await request(unknownServer).get('/health').expect(200);
    const BodySchema = z.object({
      status: z.literal('ok'),
      info: z.object({
        database: z.object({ status: z.string() }),
        db_rows: z.object({
          status: z.string(),
          totalRows: z.number().optional(),
        }),
        memory_heap: z.object({ status: z.string() }),
        memory_rss: z.object({ status: z.string() }),
      }),
    });
    const body = BodySchema.parse(res.body);
    expect(body).toMatchObject({
      status: 'ok',
      info: {
        database: { status: 'up' },
        db_rows: { status: 'up' },
        memory_heap: { status: 'up' },
        memory_rss: { status: 'up' },
      },
    });
  });

  it('GET /health/liveness returns ok with memory indicators', async () => {
    const unknownServer: unknown = app.getHttpServer();
    if (!isHttpServer(unknownServer)) {
      throw new Error('HTTP server not started');
    }
    const res = await request(unknownServer)
      .get('/health/liveness')
      .expect(200);
    const BodySchema = z.object({
      status: z.literal('ok'),
      info: z.object({
        memory_heap: z.object({ status: z.string() }),
        memory_rss: z.object({ status: z.string() }),
      }),
    });
    const body = BodySchema.parse(res.body);
    expect(body).toMatchObject({
      status: 'ok',
      info: {
        memory_heap: { status: 'up' },
        memory_rss: { status: 'up' },
      },
    });
  });

  it('GET /health/readiness returns ok with db rows and storage', async () => {
    const unknownServer: unknown = app.getHttpServer();
    if (!isHttpServer(unknownServer)) {
      throw new Error('HTTP server not started');
    }
    const res = await request(unknownServer)
      .get('/health/readiness')
      .expect(200);
    const BodySchema = z.object({
      status: z.literal('ok'),
      info: z.object({
        database: z.object({ status: z.string() }),
        db_rows: z.object({
          status: z.string(),
          totalRows: z.number().optional(),
        }),
        storage: z.object({ status: z.string() }),
      }),
    });
    const body = BodySchema.parse(res.body);
    expect(body).toMatchObject({
      status: 'ok',
      info: {
        database: { status: 'up' },
        db_rows: { status: 'up' },
        storage: { status: 'up' },
      },
    });
  });
});
