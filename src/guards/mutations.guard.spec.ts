import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OperationTypeNode } from 'graphql';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MutationsGuard } from './mutations.guard';

// Mock the env module
vi.mock('../env', () => ({
  env: {
    ENABLE_MUTATIONS: false,
  },
}));

// Mock GqlExecutionContext
vi.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: vi.fn(),
  },
}));

describe('MutationsGuard', () => {
  let guard: MutationsGuard;
  let mockContext: ExecutionContext;
  let mockGqlContext: { getInfo: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    guard = new MutationsGuard();
    mockContext = {} as ExecutionContext;
    mockGqlContext = {
      getInfo: vi.fn(),
    };
    (GqlExecutionContext.create as ReturnType<typeof vi.fn>).mockReturnValue(
      mockGqlContext,
    );
  });

  it('should allow queries when mutations are disabled', () => {
    mockGqlContext.getInfo.mockReturnValue({
      operation: {
        operation: OperationTypeNode.QUERY,
      },
    });

    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should allow subscriptions when mutations are disabled', () => {
    mockGqlContext.getInfo.mockReturnValue({
      operation: {
        operation: OperationTypeNode.SUBSCRIPTION,
      },
    });

    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException for mutations when disabled', () => {
    mockGqlContext.getInfo.mockReturnValue({
      operation: {
        operation: OperationTypeNode.MUTATION,
      },
    });

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(mockContext)).toThrow(
      'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
    );
  });

  it('should allow mutations when ENABLE_MUTATIONS is true', async () => {
    // Mock environment with mutations enabled
    const { env } = await import('../env');
    vi.mocked(env).ENABLE_MUTATIONS = true;

    mockGqlContext.getInfo.mockReturnValue({
      operation: {
        operation: OperationTypeNode.MUTATION,
      },
    });

    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should handle missing GraphQL context gracefully', () => {
    mockGqlContext.getInfo.mockReturnValue(null);

    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });
});
