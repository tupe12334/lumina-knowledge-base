import { describe, it, expect, vi } from 'vitest';
import { DbRowsHealthIndicator } from './db-rows.indicator';
import type { PrismaService } from 'src/prisma/prisma.service';

const mockDelegate = (count: number) => ({
  count: vi.fn().mockResolvedValue(count),
});

type PrismaPickMock = Record<string, { count: () => Promise<number> }> & {
  university: { count: () => Promise<number> };
  faculty: { count: () => Promise<number> };
  degree: { count: () => Promise<number> };
  course: { count: () => Promise<number> };
  module: { count: () => Promise<number> };
  block: { count: () => Promise<number> };
  blockRelationship: { count: () => Promise<number> };
  relationshipMetadata: { count: () => Promise<number> };
  translation: { count: () => Promise<number> };
  question: { count: () => Promise<number> };
  questionPart: { count: () => Promise<number> };
  answer: { count: () => Promise<number> };
  selectAnswer: { count: () => Promise<number> };
  unitAnswer: { count: () => Promise<number> };
  numberAnswer: { count: () => Promise<number> };
  learningResource: { count: () => Promise<number> };
};

describe('DbRowsHealthIndicator', () => {
  it('returns up when total rows > min', async () => {
    const indicator = new DbRowsHealthIndicator({
      university: mockDelegate(10),
      faculty: mockDelegate(10),
      degree: mockDelegate(10),
      course: mockDelegate(10),
      module: mockDelegate(10),
      block: mockDelegate(10),
      blockRelationship: mockDelegate(10),
      relationshipMetadata: mockDelegate(10),
      translation: mockDelegate(10),
      question: mockDelegate(10),
      questionPart: mockDelegate(10),
      answer: mockDelegate(10),
      selectAnswer: mockDelegate(10),
      unitAnswer: mockDelegate(10),
      numberAnswer: mockDelegate(10),
      learningResource: mockDelegate(10),
    } as PrismaPickMock as unknown as PrismaService);

    const res = (await indicator.isHealthy('db_rows', 100)) as unknown as {
      db_rows: { status: string; totalRows: number };
    };
    expect(res.db_rows.status).toBe('up');
    expect(res.db_rows.totalRows).toBeGreaterThan(100);
  });

  it('throws HealthCheckError when total rows <= min', async () => {
    const indicator = new DbRowsHealthIndicator({
      university: mockDelegate(1),
      faculty: mockDelegate(1),
      degree: mockDelegate(1),
      course: mockDelegate(1),
      module: mockDelegate(1),
      block: mockDelegate(1),
      blockRelationship: mockDelegate(1),
      relationshipMetadata: mockDelegate(1),
      translation: mockDelegate(1),
      question: mockDelegate(1),
      questionPart: mockDelegate(1),
      answer: mockDelegate(1),
      selectAnswer: mockDelegate(1),
      unitAnswer: mockDelegate(1),
      numberAnswer: mockDelegate(1),
      learningResource: mockDelegate(1),
    } as PrismaPickMock as unknown as PrismaService);

    await expect(indicator.isHealthy('db_rows', 100)).rejects.toMatchObject({
      message: 'db_rows',
    });
  });
});
