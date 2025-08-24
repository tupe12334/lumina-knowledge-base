import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseRelationshipInput } from './dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from './dto/delete-course-relationship.input';

describe('CoursesService', () => {
  let service: CoursesService;
  const mockPrismaService = {
    course: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    blockRelationship: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(() => {
    service = new CoursesService(mockPrismaService as unknown as PrismaService);
  });

  it('returns courses from prisma', async () => {
    const course = {
      id: '1',
      name: { en_text: 'course', he_text: 'קורס' },
      institutionId: 'i1',
      publishedAt: new Date(),
      institution: {
        id: 'i1',
        name: { en_text: 'institution', he_text: 'מוסד' },
      },
    };
    mockPrismaService.course.findMany.mockResolvedValue([course]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('course');
    expect(result[0].institution).toBeDefined();
    expect(result[0].institution!.name.en_text).toBe('institution');
  });

  describe('generateSummary', () => {
    it('should generate a comprehensive course summary', async () => {
      const mockCourse = {
        id: 'course-123',
        name: {
          en_text: 'Introduction to Computer Science',
          he_text: 'מבוא למדעי המחשב',
        },
        description: { en_text: 'Fundamental concepts', he_text: 'מושגי יסוד' },
        creditPoints: 4.5,
        institution: {
          name: {
            en_text: 'Harvard University',
            he_text: 'אוניברסיטת הרווארד',
          },
        },
        Degree: [
          {
            name: {
              en_text: 'Bachelor of CS',
              he_text: 'תואר ראשון במדעי המחשב',
            },
          },
        ],
        modules: [
          {
            name: { en_text: 'Algorithms', he_text: 'אלגוריתמים' },
          },
          {
            name: { en_text: 'Data Structures', he_text: 'מבני נתונים' },
          },
        ],
        CourseBlocks: [],
      };

      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);

      const result = await service.generateSummary('course-123');

      expect(result).toContain('Course: Introduction to Computer Science');
      expect(result).toContain('ID: course-123');
      expect(result).toContain('Institution: Harvard University');
      expect(result).toContain('Associated Degrees: Bachelor of CS');
      expect(result).toContain(
        'Modules: 2 modules - Algorithms, Data Structures',
      );
    });

    it('should handle course with no blocks', async () => {
      const mockCourse = {
        id: 'course-456',
        name: { en_text: 'Simple Course', he_text: 'קורס פשוט' },
        description: { en_text: 'Basic course', he_text: 'קורס בסיסי' },
        creditPoints: 2.0,
        institution: {
          name: { en_text: 'Small College', he_text: 'מכללה קטנה' },
        },
        Degree: [],
        modules: [],
        CourseBlocks: [],
      };

      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);

      const result = await service.generateSummary('course-456');

      expect(result).toContain('Course: Simple Course');
      expect(result).toContain('Associated Degrees: None');
      expect(result).toContain('Modules: 0 modules - None');
    });

    it('should throw NotFoundException when course does not exist', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        'Course with ID non-existent not found',
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.course.findUnique.mockRejectedValue(dbError);

      await expect(service.generateSummary('course-123')).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.generateSummary('course-123')).rejects.toThrow(
        'Failed to generate course summary',
      );
    });
  });

  describe('createCourseRelationship', () => {
    it('should create a relationship between two courses', async () => {
      const input: CreateCourseRelationshipInput = {
        prerequisiteCourseId: 'course-1',
        postrequisiteCourseId: 'course-2',
        metadata: { type: 'hard' },
      };

      const mockCourse1 = {
        id: 'course-1',
        Block: { id: 'block-1' },
      };
      const mockCourse2 = {
        id: 'course-2',
        Block: { id: 'block-2' },
      };

      const mockRelationship = {
        id: 'relationship-1',
        prerequisite: { id: 'block-1' },
        postrequisite: { id: 'block-2' },
        metadata: [{ key: 'TYPE', value: 'hard' }],
      };

      mockPrismaService.course.findUnique
        .mockResolvedValueOnce(mockCourse1)
        .mockResolvedValueOnce(mockCourse2);
      mockPrismaService.blockRelationship.findUnique.mockResolvedValue(null);
      mockPrismaService.blockRelationship.create.mockResolvedValue(
        mockRelationship,
      );

      const result = await service.createCourseRelationship(input);

      expect(result.id).toBe('relationship-1');
      expect(result.metadata).toBe('{"TYPE":"hard"}');
    });

    it('should throw BadRequestException if same course is used for both prerequisite and postrequisite', async () => {
      const input: CreateCourseRelationshipInput = {
        prerequisiteCourseId: 'course-1',
        postrequisiteCourseId: 'course-1',
      };

      await expect(service.createCourseRelationship(input)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if prerequisite course does not exist', async () => {
      const input: CreateCourseRelationshipInput = {
        prerequisiteCourseId: 'non-existent',
        postrequisiteCourseId: 'course-2',
      };

      mockPrismaService.course.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'course-2', Block: { id: 'block-2' } });

      await expect(service.createCourseRelationship(input)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteCourseRelationship', () => {
    it('should delete a relationship between two courses', async () => {
      const input: DeleteCourseRelationshipInput = {
        prerequisiteCourseId: 'course-1',
        postrequisiteCourseId: 'course-2',
      };

      const mockCourse1 = {
        id: 'course-1',
        Block: { id: 'block-1' },
      };
      const mockCourse2 = {
        id: 'course-2',
        Block: { id: 'block-2' },
      };

      const mockRelationship = {
        id: 'relationship-1',
        prerequisite: { id: 'block-1' },
        postrequisite: { id: 'block-2' },
        metadata: [{ key: 'TYPE', value: 'hard' }],
      };

      mockPrismaService.course.findUnique
        .mockResolvedValueOnce(mockCourse1)
        .mockResolvedValueOnce(mockCourse2);
      mockPrismaService.blockRelationship.findUnique.mockResolvedValue(
        mockRelationship,
      );
      mockPrismaService.blockRelationship.delete.mockResolvedValue(
        mockRelationship,
      );

      const result = await service.deleteCourseRelationship(input);

      expect(result.id).toBe('relationship-1');
      expect(result.metadata).toBe('{"TYPE":"hard"}');
    });

    it('should throw NotFoundException if relationship does not exist', async () => {
      const input: DeleteCourseRelationshipInput = {
        prerequisiteCourseId: 'course-1',
        postrequisiteCourseId: 'course-2',
      };

      const mockCourse1 = {
        id: 'course-1',
        Block: { id: 'block-1' },
      };
      const mockCourse2 = {
        id: 'course-2',
        Block: { id: 'block-2' },
      };

      mockPrismaService.course.findUnique
        .mockResolvedValueOnce(mockCourse1)
        .mockResolvedValueOnce(mockCourse2);
      mockPrismaService.blockRelationship.findUnique.mockResolvedValue(null);

      await expect(service.deleteCourseRelationship(input)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
