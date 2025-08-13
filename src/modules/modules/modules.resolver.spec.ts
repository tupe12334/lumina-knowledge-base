import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModulesResolver } from './modules.resolver';
import { ModulesService } from './modules.service';

describe('ModulesResolver', () => {
  let resolver: ModulesResolver;
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

  describe('mutations (resolver methods)', () => {
    it('should have createModuleRelationship method', () => {
      expect(typeof resolver.createModuleRelationship).toBe('function');
    });

    it('should have deleteModuleRelationship method', () => {
      expect(typeof resolver.deleteModuleRelationship).toBe('function');
    });

    it('should call service method for createModuleRelationship', async () => {
      const mockInput = {
        prerequisiteModuleId: '1',
        postrequisiteModuleId: '2',
      };
      const mockResult = {
        id: '123',
        prerequisiteModuleId: '1',
        postrequisiteModuleId: '2',
      };
      mockModulesService.createModuleRelationship.mockResolvedValue(mockResult);

      const result = await resolver.createModuleRelationship(mockInput);

      expect(result).toEqual(mockResult);
      expect(mockModulesService.createModuleRelationship).toHaveBeenCalledWith(
        mockInput,
      );
    });

    it('should call service method for deleteModuleRelationship', async () => {
      const mockInput = {
        prerequisiteModuleId: '1',
        postrequisiteModuleId: '2',
      };
      const mockResult = {
        id: '123',
        prerequisiteModuleId: '1',
        postrequisiteModuleId: '2',
      };
      mockModulesService.deleteModuleRelationship.mockResolvedValue(mockResult);

      const result = await resolver.deleteModuleRelationship(mockInput);

      expect(result).toEqual(mockResult);
      expect(mockModulesService.deleteModuleRelationship).toHaveBeenCalledWith(
        mockInput,
      );
    });
  });
});
