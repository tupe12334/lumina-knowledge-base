import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CoursesResolver } from './courses.resolver';
import { CoursesService } from './courses.service';
import { CreateCourseRelationshipInput } from './dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from './dto/delete-course-relationship.input';

describe('CoursesResolver', () => {
  let resolver: CoursesResolver;
  const mockCoursesService = {
    findAll: vi.fn(),
    findUnique: vi.fn(),
    createCourseRelationship: vi.fn(),
    deleteCourseRelationship: vi.fn(),
  };

  beforeEach(() => {
    resolver = new CoursesResolver(
      mockCoursesService as unknown as CoursesService,
    );
  });

  describe('getCourses', () => {
    it('should return all courses', async () => {
      const mockCourses = [
        {
          id: '1',
          name: { en_text: 'Course 1', he_text: 'קורס 1' },
        },
      ];
      mockCoursesService.findAll.mockResolvedValue(mockCourses);

      const result = await resolver.getCourses();

      expect(result).toBe(mockCourses);
      expect(mockCoursesService.findAll).toHaveBeenCalled();
    });
  });

  describe('getCourse', () => {
    it('should return a specific course', async () => {
      const mockCourse = {
        id: '1',
        name: { en_text: 'Course 1', he_text: 'קורס 1' },
      };
      mockCoursesService.findUnique.mockResolvedValue(mockCourse);

      const result = await resolver.getCourse('1');

      expect(result).toBe(mockCourse);
      expect(mockCoursesService.findUnique).toHaveBeenCalledWith('1');
    });
  });

  describe('createCourseRelationship', () => {
    it('should create a course relationship', async () => {
      const input: CreateCourseRelationshipInput = {
        prerequisiteCourseId: 'course-1',
        postrequisiteCourseId: 'course-2',
        metadata: { type: 'hard' },
      };

      const mockResult = {
        id: 'relationship-1',
        prerequisite: { id: 'block-1' },
        postrequisite: { id: 'block-2' },
        metadata: '{"type":"hard"}',
      };

      mockCoursesService.createCourseRelationship.mockResolvedValue(mockResult);

      const result = await resolver.createCourseRelationship(input);

      expect(result).toBe(mockResult);
      expect(mockCoursesService.createCourseRelationship).toHaveBeenCalledWith(
        input,
      );
    });
  });

  describe('deleteCourseRelationship', () => {
    it('should delete a course relationship', async () => {
      const input: DeleteCourseRelationshipInput = {
        prerequisiteCourseId: 'course-1',
        postrequisiteCourseId: 'course-2',
      };

      const mockResult = {
        id: 'relationship-1',
        prerequisite: { id: 'block-1' },
        postrequisite: { id: 'block-2' },
        metadata: '{"type":"hard"}',
      };

      mockCoursesService.deleteCourseRelationship.mockResolvedValue(mockResult);

      const result = await resolver.deleteCourseRelationship(input);

      expect(result).toBe(mockResult);
      expect(mockCoursesService.deleteCourseRelationship).toHaveBeenCalledWith(
        input,
      );
    });
  });
});
