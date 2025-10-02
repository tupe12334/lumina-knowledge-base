import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InstitutionsService } from './institutions.service';
import { InstitutionsQueryService } from './services/institutions-query.service';
import { InstitutionsCrudService } from './services/institutions-crud.service';
import { InstitutionsSummaryService } from './services/institutions-summary.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('InstitutionsService', () => {
  let service: InstitutionsService;
  let mockQueryService: Partial<InstitutionsQueryService>;
  let mockCrudService: Partial<InstitutionsCrudService>;
  let mockSummaryService: Partial<InstitutionsSummaryService>;

  beforeEach(() => {
    mockQueryService = {
      findAll: vi.fn(),
      findUnique: vi.fn(),
    };
    mockCrudService = {};
    mockSummaryService = {
      generateSummary: vi.fn(),
    };
    // @ts-expect-error - Mocking services for tests
    service = new InstitutionsService(mockQueryService, mockCrudService, mockSummaryService);
  });

  it('returns institutions from prisma', async () => {
    const institution = {
      id: '1',
      name: { en_text: 'test', he_text: 'טסט' },
      courses: [
        {
          id: 'c1',
          name: { en_text: 'course', he_text: 'קורס' },
          institutionId: '1',
          publishedAt: new Date(),
        },
      ],
    };
    if (mockQueryService.findAll) {
      vi.mocked(mockQueryService.findAll).mockResolvedValue([institution]);
    }

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('test');
    expect(result[0].courses).toHaveLength(1);
    expect(result[0].courses && result[0].courses.length > 0 && result[0].courses[0].name.en_text).toBe('course');
  });

  describe('generateSummary', () => {
    it('should generate a comprehensive institution summary', async () => {
      const mockSummary = `Institution: Harvard University
ID: inst-123
Faculties: 2 faculties including Computer Science, Mathematics
Degrees: 2 degree programs
Courses: 2 courses offered
Faculty Details:
- Computer Science
- Mathematics`;

      if (mockSummaryService.generateSummary) {
        vi.mocked(mockSummaryService.generateSummary).mockResolvedValue(mockSummary);
      }

      const result = await service.generateSummary('inst-123');

      expect(result).toContain('Institution: Harvard University');
      expect(result).toContain('ID: inst-123');
      expect(result).toContain(
        'Faculties: 2 faculties including Computer Science, Mathematics',
      );
      expect(result).toContain('Degrees: 2 degree programs');
      expect(result).toContain('Courses: 2 courses offered');
      expect(result).toContain('Faculty Details:');
      expect(result).toContain('- Computer Science');
      expect(result).toContain('- Mathematics');
    });

    it('should handle institution with no faculties', async () => {
      const mockSummary = `Institution: Simple University
ID: inst-456
Faculties: 0 faculties
Degrees: 0 degree programs
Courses: 0 courses offered`;

      if (mockSummaryService.generateSummary) {
        vi.mocked(mockSummaryService.generateSummary).mockResolvedValue(mockSummary);
      }

      const result = await service.generateSummary('inst-456');

      expect(result).toContain('Institution: Simple University');
      expect(result).toContain('ID: inst-456');
      expect(result).toContain('Faculties: 0 faculties');
      expect(result).toContain('Degrees: 0 degree programs');
      expect(result).toContain('Courses: 0 courses offered');
    });

    it('should handle missing English translations gracefully', async () => {
      const mockSummary = `Institution:
ID: inst-789
Faculties: 1 faculties including No English translation available
Degrees: 1 degree programs
Courses: 1 courses offered`;

      if (mockSummaryService.generateSummary) {
        vi.mocked(mockSummaryService.generateSummary).mockResolvedValue(mockSummary);
      }

      const result = await service.generateSummary('inst-789');

      expect(result).toContain('Institution:');
      expect(result).toContain('ID: inst-789');
      expect(result).toContain('Faculties: 1 faculties including No English translation available');
      expect(result).toContain('Degrees: 1 degree programs');
      expect(result).toContain('Courses: 1 courses offered');
    });

    it('should throw NotFoundException when institution does not exist', async () => {
      if (mockSummaryService.generateSummary) {
        vi.mocked(mockSummaryService.generateSummary).mockRejectedValue(
          new NotFoundException('Institution not found'),
        );
      }

      await expect(service.generateSummary('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      if (mockSummaryService.generateSummary) {
        vi.mocked(mockSummaryService.generateSummary).mockRejectedValue(
          new InternalServerErrorException('Database connection failed'),
        );
      }

      await expect(service.generateSummary('inst-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});