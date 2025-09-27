import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InstitutionsService } from './institutions.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('InstitutionsService', () => {
  let service: InstitutionsService;
  let mockPrismaService: Partial<PrismaService>;

  beforeEach(() => {
    mockPrismaService = {
      institution: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
    };
    service = new InstitutionsService(mockPrismaService);
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
    if (mockPrismaService.institution && mockPrismaService.institution.findMany) {
      vi.mocked(mockPrismaService.institution.findMany).mockResolvedValue([institution]);
    }

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('test');
    expect(result[0].courses).toHaveLength(1);
    expect(result[0].courses && result[0].courses.length > 0 && result[0].courses[0].name.en_text).toBe('course');
  });

  describe('generateSummary', () => {
    it('should generate a comprehensive institution summary', async () => {
      const mockInstitution = {
        id: 'inst-123',
        name: { en_text: 'Harvard University', he_text: 'אוניברסיטת הרווארד' },
        Faculty: [
          { name: { en_text: 'Computer Science', he_text: 'מדעי המחשב' } },
          { name: { en_text: 'Mathematics', he_text: 'מתמטיקה' } },
        ],
        Degree: [
          {
            name: {
              en_text: 'BSc Computer Science',
              he_text: 'תואר ראשון במדעי המחשב',
            },
          },
          {
            name: { en_text: 'MSc Mathematics', he_text: 'תואר שני במתמטיקה' },
          },
        ],
        courses: [
          { name: { en_text: 'Algorithms', he_text: 'אלגוריתמים' } },
          { name: { en_text: 'Calculus', he_text: 'חשבון אינפיניטסימלי' } },
        ],
      };

      if (mockPrismaService.institution && mockPrismaService.institution.findUnique) {
        vi.mocked(mockPrismaService.institution.findUnique).mockResolvedValue(mockInstitution);
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
      const mockInstitution = {
        id: 'inst-456',
        name: { en_text: 'Simple University', he_text: 'אוניברסיטה פשוטה' },
        Faculty: [],
        Degree: [],
        courses: [],
      };

      if (mockPrismaService.institution && mockPrismaService.institution.findUnique) {
        vi.mocked(mockPrismaService.institution.findUnique).mockResolvedValue(mockInstitution);
      }

      const result = await service.generateSummary('inst-456');

      expect(result).toContain('Institution: Simple University');
      expect(result).toContain('ID: inst-456');
      expect(result).toContain('Faculties: 0 faculties');
      expect(result).toContain('Degrees: 0 degree programs');
      expect(result).toContain('Courses: 0 courses offered');
    });

    it('should handle missing English translations gracefully', async () => {
      const mockInstitution = {
        id: 'inst-789',
        name: { he_text: 'אוניברסיטה עברית בלבד' },
        Faculty: [
          { name: { he_text: 'מדעי המחשב' } },
        ],
        Degree: [
          {
            name: { he_text: 'תואר ראשון במדעי המחשב' },
          },
        ],
        courses: [
          { name: { he_text: 'אלגוריתמים' } },
        ],
      };

      if (mockPrismaService.institution && mockPrismaService.institution.findUnique) {
        vi.mocked(mockPrismaService.institution.findUnique).mockResolvedValue(mockInstitution);
      }

      const result = await service.generateSummary('inst-789');

      expect(result).toContain('Institution:');
      expect(result).toContain('ID: inst-789');
      expect(result).toContain('Faculties: 1 faculties including No English translation available');
      expect(result).toContain('Degrees: 1 degree programs');
      expect(result).toContain('Courses: 1 courses offered');
    });

    it('should throw NotFoundException when institution does not exist', async () => {
      mockPrismaService.institution.findUnique.mockResolvedValue(null);

      await expect(service.generateSummary('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.institution.findUnique.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.generateSummary('inst-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});