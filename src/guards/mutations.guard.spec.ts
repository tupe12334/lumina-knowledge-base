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

// Test interfaces
interface MockGqlContext {
  getType(): string;
}

interface MockHttpContext {
  getType(): string;
  switchToHttp(): unknown;
}

// Test setup helpers
const createMutationsGuardTestSetup = () => {
  const guard = new MutationsGuard();
  const mockGqlContext = { getInfo: vi.fn() };
  const mockHttpContext = { getRequest: vi.fn() };

  const mockedCreate = vi.mocked(GqlExecutionContext.create);
  mockedCreate.mockReturnValue(mockGqlContext);

  return { guard, mockGqlContext, mockHttpContext };
};

const setupGraphQLContext = async (mockGqlContext: unknown): Promise<ExecutionContext> => {
  const { env } = await import('../env');
  vi.mocked(env).ENABLE_MUTATIONS = false;

  const mockContext = {
    getType: vi.fn().mockReturnValue('graphql'),
  } satisfies ExecutionContext;
  return mockContext;
};

const setupHttpContext = async (mockHttpContext: unknown): Promise<ExecutionContext> => {
  const { env } = await import('../env');
  vi.mocked(env).ENABLE_MUTATIONS = false;

  const mockContext = {
    getType: vi.fn().mockReturnValue('http'),
    switchToHttp: vi.fn().mockReturnValue(mockHttpContext),
  } satisfies ExecutionContext;
  return mockContext;
};

// Test helper functions for GraphQL tests
const createGraphQLTests = (
  guard: MutationsGuard,
  mockContext: ExecutionContext,
  mockGqlContext: { getInfo: ReturnType<typeof vi.fn> }
) => ({
  testAllowQueries: () => {
    mockGqlContext.getInfo.mockReturnValue({
      operation: { operation: OperationTypeNode.QUERY },
    });
    expect(guard.canActivate(mockContext)).toBe(true);
  },

  testAllowSubscriptions: () => {
    mockGqlContext.getInfo.mockReturnValue({
      operation: { operation: OperationTypeNode.SUBSCRIPTION },
    });
    expect(guard.canActivate(mockContext)).toBe(true);
  },

  testThrowForMutations: () => {
    mockGqlContext.getInfo.mockReturnValue({
      operation: { operation: OperationTypeNode.MUTATION },
    });
    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(mockContext)).toThrow(
      'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
    );
  },

  testAllowMutationsWhenEnabled: async () => {
    const { env } = await import('../env');
    vi.mocked(env).ENABLE_MUTATIONS = true;

    mockGqlContext.getInfo.mockReturnValue({
      operation: { operation: OperationTypeNode.MUTATION },
    });
    expect(guard.canActivate(mockContext)).toBe(true);
  },

  testHandleMissingContext: () => {
    mockGqlContext.getInfo.mockReturnValue(null);
    expect(guard.canActivate(mockContext)).toBe(true);
  }
});

// Test helper functions for HTTP tests
const createHttpTests = (
  guard: MutationsGuard,
  mockContext: ExecutionContext,
  mockHttpContext: { getRequest: ReturnType<typeof vi.fn> }
) => ({
  testAllowSafeMethods: () => {
    ['GET', 'HEAD', 'OPTIONS'].forEach(method => {
      mockHttpContext.getRequest.mockReturnValue({ method });
      expect(guard.canActivate(mockContext)).toBe(true);
    });
  },

  testThrowForMutativeMethods: () => {
    ['POST', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
      mockHttpContext.getRequest.mockReturnValue({ method });
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });
  },

  testAllowPostWhenEnabled: async () => {
    const { env } = await import('../env');
    vi.mocked(env).ENABLE_MUTATIONS = true;

    mockHttpContext.getRequest.mockReturnValue({ method: 'POST' });
    expect(guard.canActivate(mockContext)).toBe(true);
  },

  testHandleMissingMethod: () => {
    mockHttpContext.getRequest.mockReturnValue({});
    expect(guard.canActivate(mockContext)).toBe(true);
  }
});

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
    let graphQLTests: ReturnType<typeof createGraphQLTests>;

    beforeEach(async () => {
      mockContext = await setupGraphQLContext(mockGqlContext);
      graphQLTests = createGraphQLTests(guard, mockContext, mockGqlContext);
    });

    it('should allow queries when mutations are disabled', () => {
      graphQLTests.testAllowQueries();
    });

    it('should allow subscriptions when mutations are disabled', () => {
      graphQLTests.testAllowSubscriptions();
    });

    it('should throw ForbiddenException for mutations when disabled', () => {
      graphQLTests.testThrowForMutations();
    });

    it('should allow mutations when ENABLE_MUTATIONS is true', async () => {
      await graphQLTests.testAllowMutationsWhenEnabled();
    });

    it('should handle missing GraphQL context gracefully', () => {
      graphQLTests.testHandleMissingContext();
    });
  });

  describe('HTTP Context', () => {
    let httpTests: ReturnType<typeof createHttpTests>;

    beforeEach(async () => {
      mockContext = await setupHttpContext(mockHttpContext);
      httpTests = createHttpTests(guard, mockContext, mockHttpContext);
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
      await httpTests.testAllowPostWhenEnabled();
    });

    it('should handle missing method gracefully', () => {
      httpTests.testHandleMissingMethod();
    });
  });

  describe('Other Context Types', () => {
    it('should allow microservice context types', () => {
      const rpcContext = {
        getType: vi.fn().mockReturnValue('rpc'),
      } satisfies ExecutionContext;
      mockContext = rpcContext;

      expect(guard.canActivate(mockContext)).toBe(true);
    });
  });
});