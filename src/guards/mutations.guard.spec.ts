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
  let mockHttpContext: {
    getRequest: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    guard = new MutationsGuard();
    mockGqlContext = {
      getInfo: vi.fn(),
    };
    mockHttpContext = {
      getRequest: vi.fn(),
    };
    (GqlExecutionContext.create as ReturnType<typeof vi.fn>).mockReturnValue(
      mockGqlContext,
    );
  });

  describe('GraphQL Context', () => {
    beforeEach(async () => {
      // Reset mutations to disabled for each test
      const { env } = await import('../env');
      vi.mocked(env).ENABLE_MUTATIONS = false;
      
      mockContext = {
        getType: vi.fn().mockReturnValue('graphql'),
      } as unknown as ExecutionContext;
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

  describe('HTTP Context', () => {
    beforeEach(async () => {
      // Reset mutations to disabled for each test
      const { env } = await import('../env');
      vi.mocked(env).ENABLE_MUTATIONS = false;
      
      mockContext = {
        getType: vi.fn().mockReturnValue('http'),
        switchToHttp: vi.fn().mockReturnValue(mockHttpContext),
      } as unknown as ExecutionContext;
    });

    it('should allow GET requests when mutations are disabled', () => {
      mockHttpContext.getRequest.mockReturnValue({ method: 'GET' });

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should allow HEAD requests when mutations are disabled', () => {
      mockHttpContext.getRequest.mockReturnValue({ method: 'HEAD' });

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should allow OPTIONS requests when mutations are disabled', () => {
      mockHttpContext.getRequest.mockReturnValue({ method: 'OPTIONS' });

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
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
      // Mock environment with mutations enabled
      const { env } = await import('../env');
      vi.mocked(env).ENABLE_MUTATIONS = true;

      mockHttpContext.getRequest.mockReturnValue({ method: 'POST' });

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should handle missing method gracefully', () => {
      mockHttpContext.getRequest.mockReturnValue({});

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });

  describe('Other Context Types', () => {
    it('should allow microservice context types', () => {
      mockContext = {
        getType: vi.fn().mockReturnValue('rpc'),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });
});
