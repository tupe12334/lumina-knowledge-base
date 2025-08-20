import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UniversitiesService } from './universities.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('UniversitiesService', () => {
  let service: UniversitiesService;
  const mockPrismaService = {
    university: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };

  beforeEach(() => {
    service = new UniversitiesService(
      mockPrismaService as unknown as PrismaService,
    );
  });

  it('returns universities from prisma', async () => {
    const university = {
      id: '1',
      name: { en_text: 'test', he_text: 'טסט' },
      courses: [
        {
          id: 'c1',
          name: { en_text: 'course', he_text: 'קורס' },
          universityId: '1',
          publishedAt: new Date(),
        },
      ],
    };
    mockPrismaService.university.findMany.mockResolvedValue([university]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('test');
    expect(result[0].courses).toHaveLength(1);
    expect(result[0].courses?.[0]?.name.en_text).toBe('course');
  });

  describe('generateSummary', () => {
    it('should generate a comprehensive university summary', async () => {
      const mockUniversity = {
        id: 'uni-123',
        name: { en_text: 'Harvard University', he_text: 'אוניברסיטת הרווארד' },
        Faculty: [
          { name: { en_text: 'Computer Science', he_text: 'מדעי המחשב' } },
          { name: { en_text: 'Mathematics', he_text: 'מתמטיקה' } },
        ],
        Degree: [
          { name: { en_text: 'BSc Computer Science', he_text: 'תואר ראשון במדעי המחשב' } },
          { name: { en_text: 'MSc Mathematics', he_text: 'תואר שני במתמטיקה' } },
        ],
        courses: [
          { name: { en_text: 'Algorithms', he_text: 'אלגוריתמים' } },
          { name: { en_text: 'Calculus', he_text: 'חשבון אינפיניטסימלי' } },
        ],
      };

      mockPrismaService.university.findUnique.mockResolvedValue(mockUniversity);

      const result = await service.generateSummary('uni-123');

      expect(result).toContain('University: Harvard University');
      expect(result).toContain('ID: uni-123');
      expect(result).toContain('Faculties: 2 faculties including Computer Science, Mathematics');
      expect(result).toContain('Degrees: 2 degree programs');
      expect(result).toContain('Courses: 2 courses offered');
      expect(result).toContain('Faculty Details:');
      expect(result).toContain('- Computer Science');
      expect(result).toContain('- Mathematics');
    });

    it('should handle university with no faculties', async () => {
      const mockUniversity = {
        id: 'uni-456',
        name: { en_text: 'Small College', he_text: 'מכללה קטנה' },
        Faculty: [],
        Degree: [],
        courses: [],
      };

      mockPrismaService.university.findUnique.mockResolvedValue(mockUniversity);

      const result = await service.generateSummary('uni-456');

      expect(result).toContain('University: Small College');
      expect(result).toContain('Faculties: 0 faculties including none');
      expect(result).toContain('Faculty Details:\nNo faculties available');
    });

    it('should handle missing English translations gracefully', async () => {
      const mockUniversity = {
        id: 'uni-789',
        name: { en_text: '', he_text: 'אוניברסיטה בעברית' },
        Faculty: [
          { name: { en_text: '', he_text: 'פקולטה בעברית' } },
        ],
        Degree: [],
        courses: [],
      };

      mockPrismaService.university.findUnique.mockResolvedValue(mockUniversity);

      const result = await service.generateSummary('uni-789');

      expect(result).toContain('University: No English translation available');
      expect(result).toContain('Faculties: 1 faculties including No English translation available');
    });

    it('should throw NotFoundException when university does not exist', async () => {
      mockPrismaService.university.findUnique.mockResolvedValue(null);

      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        'University with ID non-existent not found',
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.university.findUnique.mockRejectedValue(dbError);

      await expect(service.generateSummary('uni-123')).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.generateSummary('uni-123')).rejects.toThrow(
        'Failed to generate university summary',
      );
    });
  });
});
