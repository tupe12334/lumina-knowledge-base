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

// Test setup helpers
const createMutationsGuardTestSetup = () => {
  const guard = new MutationsGuard();
  const mockGqlContext = { getInfo: vi.fn() };
  const mockHttpContext = { getRequest: vi.fn() };

  (GqlExecutionContext.create as ReturnType<typeof vi.fn>).mockReturnValue(
    mockGqlContext,
  );

  return { guard, mockGqlContext, mockHttpContext };
};

const setupGraphQLContext = async (mockGqlContext: any) => {
  const { env } = await import('../env');
  vi.mocked(env).ENABLE_MUTATIONS = false;

  return {
    getType: vi.fn().mockReturnValue('graphql'),
  } as unknown as ExecutionContext;
};

const setupHttpContext = async (mockHttpContext: any) => {
  const { env } = await import('../env');
  vi.mocked(env).ENABLE_MUTATIONS = false;

  return {
    getType: vi.fn().mockReturnValue('http'),
    switchToHttp: vi.fn().mockReturnValue(mockHttpContext),
  } as unknown as ExecutionContext;
};

describe('MutationsGuard', () => {
  let guard: MutationsGuard;
  let mockContext: ExecutionContext;
  let mockGqlContext: { getInfo: ReturnType<typeof vi.fn> };
  let mockHttpContext: { getRequest: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    const setup = createMutationsGuardTestSetup();
    guard = setup.guard;
    mockGqlContext = setup.mockGqlContext;
    mockHttpContext = setup.mockHttpContext;
  });

  describe('GraphQL Context', () => {
    beforeEach(async () => {
      mockContext = await setupGraphQLContext(mockGqlContext);
    });

    it('should allow queries when mutations are disabled', () => {
      mockGqlContext.getInfo.mockReturnValue({
        operation: { operation: OperationTypeNode.QUERY },
      });

      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should allow subscriptions when mutations are disabled', () => {
      mockGqlContext.getInfo.mockReturnValue({
        operation: { operation: OperationTypeNode.SUBSCRIPTION },
      });

      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should throw ForbiddenException for mutations when disabled', () => {
      mockGqlContext.getInfo.mockReturnValue({
        operation: { operation: OperationTypeNode.MUTATION },
      });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
      );
    });

    it('should allow mutations when ENABLE_MUTATIONS is true', async () => {
      const { env } = await import('../env');
      vi.mocked(env).ENABLE_MUTATIONS = true;

      mockGqlContext.getInfo.mockReturnValue({
        operation: { operation: OperationTypeNode.MUTATION },
      });

      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should handle missing GraphQL context gracefully', () => {
      mockGqlContext.getInfo.mockReturnValue(null);
      expect(guard.canActivate(mockContext)).toBe(true);
    });
  });

  describe('HTTP Context', () => {
    beforeEach(async () => {
      mockContext = await setupHttpContext(mockHttpContext);
    });

    it('should allow GET requests when mutations are disabled', () => {
      mockHttpContext.getRequest.mockReturnValue({ method: 'GET' });
      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should allow HEAD requests when mutations are disabled', () => {
      mockHttpContext.getRequest.mockReturnValue({ method: 'HEAD' });
      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should allow OPTIONS requests when mutations are disabled', () => {
      mockHttpContext.getRequest.mockReturnValue({ method: 'OPTIONS' });
      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should throw ForbiddenException for POST when mutations are disabled', () => {
      mockHttpContext.getRequest.mockReturnValue({ method: 'POST' });

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
      );
    });

    it('should throw ForbiddenException for PUT when mutations are disabled', () => {
      mockHttpContext.getRequest.mockReturnValue({ method: 'PUT' });
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException for DELETE when mutations are disabled', () => {
      mockHttpContext.getRequest.mockReturnValue({ method: 'DELETE' });
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException for PATCH when mutations are disabled', () => {
      mockHttpContext.getRequest.mockReturnValue({ method: 'PATCH' });
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });

    it('should allow POST when ENABLE_MUTATIONS is true', async () => {
      const { env } = await import('../env');
      vi.mocked(env).ENABLE_MUTATIONS = true;

      mockHttpContext.getRequest.mockReturnValue({ method: 'POST' });
      expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should handle missing method gracefully', () => {
      mockHttpContext.getRequest.mockReturnValue({});
      expect(guard.canActivate(mockContext)).toBe(true);
    });
  });

  describe('Other Context Types', () => {
    it('should allow microservice context types', () => {
      mockContext = {
        getType: vi.fn().mockReturnValue('rpc'),
      } as unknown as ExecutionContext;

      expect(guard.canActivate(mockContext)).toBe(true);
    });
  });
});