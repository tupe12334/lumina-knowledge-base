import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModulesResolver } from './modules.resolver';
import { ModulesService } from './modules.service';
import { MutationsGuard } from '../../guards/mutations.guard';

// Mock the env module
vi.mock('../../env', () => ({
  env: {
    ENABLE_MUTATIONS: false,
  },
}));

describe('ModulesResolver', () => {
  let resolver: ModulesResolver;
  let guard: MutationsGuard;
  let mockContext: ExecutionContext;
  const mockModulesService = {
    findAll: vi.fn(),
    findUnique: vi.fn(),
    createModuleRelationship: vi.fn(),
    deleteModuleRelationship: vi.fn(),
  };

  beforeEach(() => {
    resolver = new ModulesResolver(
      mockModulesService as unknown as ModulesService,
    );
    guard = new MutationsGuard();
    mockContext = {} as ExecutionContext;
  });

  describe('mutations with guard', () => {
    it('should throw ForbiddenException when ENABLE_MUTATIONS is false for createModuleRelationship', () => {
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
      );
    });

    it('should throw ForbiddenException when ENABLE_MUTATIONS is false for deleteModuleRelationship', () => {
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
      );
    });

    it('should allow mutations when ENABLE_MUTATIONS is true', async () => {
      // Mock environment with mutations enabled
      const { env } = await import('../../env');
      vi.mocked(env).ENABLE_MUTATIONS = true;

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });
  });

  describe('queries (should always work)', () => {
    it('should get modules without restriction', async () => {
      const mockModules = [{ id: '1', name: { en_text: 'Module 1' } }];
      mockModulesService.findAll.mockResolvedValue(mockModules);

      const result = await resolver.getModules();

      expect(result).toEqual(mockModules);
      expect(mockModulesService.findAll).toHaveBeenCalled();
    });

    it('should get module by id without restriction', async () => {
      const mockModule = { id: '1', name: { en_text: 'Module 1' } };
      mockModulesService.findUnique.mockResolvedValue(mockModule);

      const result = await resolver.getModule('1');

      expect(result).toEqual(mockModule);
      expect(mockModulesService.findUnique).toHaveBeenCalledWith('1');
    });
  });
});
