import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module as ModuleEntity } from './models/Module.entity';

const mockModulesService = {
  findUnique: vi.fn(),
  findAll: vi.fn(),
};

let controller: ModulesController;

beforeEach(() => {
  controller = new ModulesController(
    mockModulesService as unknown as ModulesService,
  );
  vi.clearAllMocks();
});

describe('ModulesController', () => {
  describe('getModule', () => {
    it('gets a module from service', async () => {
      const expectedModule = {
        id: 'm1',
        name: {
          id: '11111111-1111-1111-1111-111111111111',
          en_text: 'mod',
          he_text: 'מודול',
        },
        subModules: [],
        parentModules: [],
      };

      mockModulesService.findUnique.mockResolvedValue(expectedModule);

      const result = await controller.getModule('m1');

      expect(mockModulesService.findUnique).toHaveBeenCalledWith('m1');
      expect(result).toEqual(expectedModule);
    });

    it('should return null when module not found', async () => {
      const moduleId = '550e8400-e29b-41d4-a716-446655440000';
      mockModulesService.findUnique.mockResolvedValue(null);

      const result = await controller.getModule(moduleId);

      expect(result).toBeNull();
    });
  });

  describe('getModules', () => {
    it('should return all modules when no filters provided', async () => {
      const expectedModules: ModuleEntity[] = [
        {
          id: '1',
          name: {
            id: '22222222-2222-2222-2222-222222222222',
            en_text: 'Module 1',
            he_text: 'מודול 1',
          },
        },
        {
          id: '2',
          name: {
            id: '33333333-3333-3333-3333-333333333333',
            en_text: 'Module 2',
            he_text: 'מודול 2',
          },
        },
      ];

      mockModulesService.findAll.mockResolvedValue(expectedModules);

      const result = await controller.getModules({});

      expect(mockModulesService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(expectedModules);
    });

    it('should pass minQuestions filter to service', async () => {
      const queryDto = { minQuestions: 5 };
      const expectedModules: ModuleEntity[] = [];

      mockModulesService.findAll.mockResolvedValue(expectedModules);

      const result = await controller.getModules(queryDto);

      expect(mockModulesService.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(expectedModules);
    });

    it('should pass exactQuestions filter to service', async () => {
      const queryDto = { exactQuestions: 3 };
      const expectedModules: ModuleEntity[] = [];

      mockModulesService.findAll.mockResolvedValue(expectedModules);

      const result = await controller.getModules(queryDto);

      expect(mockModulesService.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(expectedModules);
    });

    it('should pass combined filters to service', async () => {
      const queryDto = { minQuestions: 2, maxQuestions: 8 };
      const expectedModules: ModuleEntity[] = [];

      mockModulesService.findAll.mockResolvedValue(expectedModules);

      const result = await controller.getModules(queryDto);

      expect(mockModulesService.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(expectedModules);
    });
  });
});
