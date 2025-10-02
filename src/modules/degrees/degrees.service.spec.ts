import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DegreesService } from './degrees.service';
import { DegreesSummaryService } from './services/degrees-summary.service';
import { DegreesRelationshipService } from './services/degrees-relationship.service';
import { DegreesQueryService } from './services/degrees-query.service';
import { DegreesCrudService } from './services/degrees-crud.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('DegreesService', () => {
  let service: DegreesService;

  const mockSummaryService = {
    generateSummary: vi.fn(),
  };

  const mockRelationshipService = {
    setFacultyForDegree: vi.fn(),
    addCourse: vi.fn(),
    removeCourse: vi.fn(),
    getCoursesByDegreeId: vi.fn(),
  };

  const mockQueryService = {
    findAll: vi.fn(),
    findUnique: vi.fn(),
    findByUniversityId: vi.fn(),
    findByFacultyId: vi.fn(),
  };

  const mockCrudService = {
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    // @ts-expect-error - Mocking services for tests
    service = new DegreesService(
      mockSummaryService,
      mockRelationshipService,
      mockQueryService,
      mockCrudService,
    );
  });

  it('returns degrees from prisma', async () => {
    const degree = {
      id: 'deg1',
      name: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
      institution: {
        name: {
          en_text: 'University of Technology',
          he_text: 'האוניברסיטה הטכנולוגית',
        },
      },
    };
    mockQueryService.findAll.mockResolvedValue([degree]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('Computer Science');
    expect(result[0].institution && result[0].institution.name.en_text).toBe('University of Technology');
    expect(mockQueryService.findAll).toHaveBeenCalledWith(undefined);
  });

  describe('findAll with search query', () => {
    it('should search degrees by English name', async () => {
      const degree = {
        id: 'deg1',
        name: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
        institution: {
          name: {
            en_text: 'University of Technology',
            he_text: 'האוניברסיטה הטכנולוגית',
          },
        },
      };
      mockQueryService.findAll.mockResolvedValue([degree]);

      await service.findAll({ name: 'Computer' });

      expect(mockQueryService.findAll).toHaveBeenCalledWith({ name: 'Computer' });
    });

    it('should search degrees by Hebrew name', async () => {
      const degree = {
        id: 'deg1',
        name: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
        institution: {
          name: {
            en_text: 'University of Technology',
            he_text: 'האוניברסיטה הטכנולוגית',
          },
        },
      };
      mockQueryService.findAll.mockResolvedValue([degree]);

      await service.findAll({ name: 'מדעי' });

      expect(mockQueryService.findAll).toHaveBeenCalledWith({ name: 'מדעי' });
    });

    it('should not apply name filter when no search term provided', async () => {
      mockQueryService.findAll.mockResolvedValue([]);

      await service.findAll({});

      expect(mockQueryService.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('generateSummary', () => {
    it('should generate a comprehensive degree summary', async () => {
      const expectedSummary = `Degree: Bachelor of Computer Science
ID: degree-123
Institution: Harvard University
Faculty: Computer Science Faculty
Associated Courses: 2 courses - Algorithms, Data Structures`;

      mockSummaryService.generateSummary.mockResolvedValue(expectedSummary);

      const result = await service.generateSummary('degree-123');

      expect(mockSummaryService.generateSummary).toHaveBeenCalledWith('degree-123');
      expect(result).toBe(expectedSummary);
    });

    it('should throw NotFoundException when degree does not exist', async () => {
      mockSummaryService.generateSummary.mockRejectedValue(
        new NotFoundException('Degree with ID non-existent not found')
      );

      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockSummaryService.generateSummary.mockRejectedValue(
        new InternalServerErrorException('Failed to generate degree summary: Database connection failed')
      );

      await expect(service.generateSummary('degree-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
