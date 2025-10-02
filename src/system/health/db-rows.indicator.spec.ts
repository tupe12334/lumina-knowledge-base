import { describe, it, expect, vi } from 'vitest';
import { DbRowsHealthIndicator } from './db-rows.indicator';

const mockDelegate = (count: number) => ({
  count: vi.fn().mockResolvedValue(count),
});

const createMockHealthIndicatorService = () => ({
  check: vi.fn().mockImplementation((key: string) => ({
    up: vi.fn().mockImplementation((data: Record<string, unknown>) => ({
      [key]: { status: 'up', ...data }
    })),
    down: vi.fn().mockImplementation((data: Record<string, unknown>) => {
      class HealthCheckError extends Error {
        constructor(message: string, public details?: Record<string, unknown>) {
          super(message);
          this.name = 'HealthCheckError';
        }
      }
      const errorDetails = { [key]: { status: 'down', ...data } };
      throw new HealthCheckError(key, errorDetails);
    })
  }))
});

describe('DbRowsHealthIndicator', () => {
  it('returns up when total rows > min', async () => {
    const mockHealthIndicatorService = createMockHealthIndicatorService();

    const mockPrismaService = {
      institution: mockDelegate(10),
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
    };
    // @ts-expect-error - Mocking PrismaService and HealthIndicatorService for tests
    const indicator = new DbRowsHealthIndicator(mockPrismaService, mockHealthIndicatorService);

    const res = await indicator.isHealthy('db_rows', 100);
    expect(res.db_rows.status).toBe('up');
    expect(res.db_rows.totalRows).toBeGreaterThan(100);
  });

  it('throws HealthCheckError when total rows <= min', async () => {
    const mockHealthIndicatorService = createMockHealthIndicatorService();

    const mockPrismaService = {
      institution: mockDelegate(1),
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
    };
    // @ts-expect-error - Mocking PrismaService and HealthIndicatorService for tests
    const indicator = new DbRowsHealthIndicator(mockPrismaService, mockHealthIndicatorService);

    await expect(indicator.isHealthy('db_rows', 100)).rejects.toMatchObject({
      message: 'db_rows',
    });
  });
});
