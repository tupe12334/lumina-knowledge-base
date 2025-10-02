import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModulesService } from './modules.service';
import { ModulesQueryService } from './services/modules-query.service';
import { ModulesCrudService } from './services/modules-crud.service';
import { ModulesRelationshipService } from './services/modules-relationship.service';
import { ModulesSummaryService } from './services/modules-summary.service';
import { NotFoundException } from '@nestjs/common';

let service: ModulesService;

const mockQueryService: Partial<ModulesQueryService> = {
  findUnique: vi.fn(),
  findAll: vi.fn(),
};

const mockCrudService: Partial<ModulesCrudService> = {};

const mockRelationshipService: Partial<ModulesRelationshipService> = {};

const mockSummaryService: Partial<ModulesSummaryService> = {
  generateSummary: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  // @ts-expect-error - Mocking services for tests
  service = new ModulesService(
    mockQueryService,
    mockCrudService,
    mockRelationshipService,
    mockSummaryService,
  );
});

describe('ModulesService', () => {
  describe('findUnique', () => {
    it('returns module from prisma', async () => {
      const mockModule = {
        id: 'test-module-1',
        name: { en_text: 'module', he_text: 'מודול' },
      };

      if (mockQueryService.findUnique) {
        // @ts-expect-error - Mocking partial module data for tests
        mockQueryService.findUnique.mockResolvedValue(mockModule);
      }

      const result = await service.findUnique('test-module-1');

      expect(result && result.id).toBe('test-module-1');
      expect(result && result.name.en_text).toBe('module');
    });
  });

  describe('findAll', () => {
    it('returns all modules when no filters provided', async () => {
      const mockModules = [
        {
          id: 'module1',
          name: { en_text: 'module1', he_text: 'מודול1' },
        },
        {
          id: 'module2',
          name: { en_text: 'module2', he_text: 'מודול2' },
        },
      ];

      if (mockQueryService.findAll) {
        // @ts-expect-error - Mocking partial module data for tests
        mockQueryService.findAll.mockResolvedValue(mockModules);
      }

      const result = await service.findAll();

      expect(result.length).toBe(2);
      expect(result.map((m) => m.id)).toContain('module1');
      expect(result.map((m) => m.id)).toContain('module2');
    });
  });

  describe('generateSummary', () => {
    it('should throw NotFoundException when module does not exist', async () => {
      if (mockSummaryService.generateSummary) {
        mockSummaryService.generateSummary.mockRejectedValue(
          new NotFoundException('Module with ID non-existent not found'),
        );
      }

      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        'Module with ID non-existent not found',
      );
    });

    it('should generate summary for module without courses', async () => {
      const moduleId = 'summary-test-module';
      const mockSummary = `Module: Empty Module
ID: ${moduleId}
Description: No courses
Courses: None`;

      if (mockSummaryService.generateSummary) {
        mockSummaryService.generateSummary.mockResolvedValue(mockSummary);
      }

      const result = await service.generateSummary(moduleId);

      expect(result).toContain('Module: Empty Module');
      expect(result).toContain(`ID: ${moduleId}`);
    });
  });
});
