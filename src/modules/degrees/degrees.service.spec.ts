import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DegreesService } from './degrees.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('DegreesService', () => {
  let service: DegreesService;
  const mockPrismaService = {
    degree: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };

  beforeEach(() => {
    service = new DegreesService(mockPrismaService as unknown as PrismaService);
  });

  it('returns degrees from prisma', async () => {
    const degree = {
      id: 'deg1',
      name: { en_text: 'Computer Science', he_text: 'מדעי המחשב' },
      university: {
        name: {
          en_text: 'University of Technology',
          he_text: 'האוניברסיטה הטכנולוגית',
        },
      },
    };
    mockPrismaService.degree.findMany.mockResolvedValue([degree]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('Computer Science');
    expect(result[0].university?.name.en_text).toBe('University of Technology');
  });

  describe('generateSummary', () => {
    it('should generate a comprehensive degree summary', async () => {
      const mockDegree = {
        id: 'degree-123',
        name: { en_text: 'Bachelor of Computer Science', he_text: 'תואר ראשון במדעי המחשב' },
        description: { en_text: 'Comprehensive CS program', he_text: 'תכנית מקיפה במדעי המחשב' },
        university: {
          name: { en_text: 'Harvard University', he_text: 'אוניברסיטת הרווארד' },
        },
        Module: [
          {
            name: { en_text: 'Core Programming', he_text: 'תכנות ליבה' },
            creditPoints: 12.0,
          },
          {
            name: { en_text: 'Advanced Algorithms', he_text: 'אלגוריתמים מתקדמים' },
            creditPoints: 8.0,
          },
        ],
        Faculty: [
          {
            name: { en_text: 'Computer Science Faculty', he_text: 'פקולטה למדעי המחשב' },
          },
        ],
      };

      mockPrismaService.degree.findUnique.mockResolvedValue(mockDegree);

      const result = await service.generateSummary('degree-123');

      expect(result).toContain('Degree: Bachelor of Computer Science');
      expect(result).toContain('ID: degree-123');
      expect(result).toContain('University: Harvard University');
      expect(result).toContain('Description: Comprehensive CS program');
      expect(result).toContain('Modules: 2 modules (20 total credits)');
      expect(result).toContain('Faculties: 1 faculties');
    });

    it('should throw NotFoundException when degree does not exist', async () => {
      mockPrismaService.degree.findUnique.mockResolvedValue(null);

      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.degree.findUnique.mockRejectedValue(dbError);

      await expect(service.generateSummary('degree-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
