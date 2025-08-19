import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { CoursesResolver } from './courses.resolver';
import { CoursesService } from './courses.service';
import { CreateCourseRelationshipInput } from './dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from './dto/delete-course-relationship.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { SetCourseModulesInput } from './dto/set-course-modules.input';
import { ModulesService } from '../modules/modules.service';

describe('CoursesResolver', () => {
  let resolver: CoursesResolver;
  const mockCoursesService = {
    findAll: vi.fn(),
    findUnique: vi.fn(),
    createCourseRelationship: vi.fn(),
    deleteCourseRelationship: vi.fn(),
    updateCourse: vi.fn(),
    setCourseModules: vi.fn(),
  };
  const mockModulesService = {
    findModulesByCourseId: vi.fn(),
  } as unknown as ModulesService;

  beforeEach(() => {
    resolver = new CoursesResolver(
      mockCoursesService as unknown as CoursesService,
      mockModulesService,
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
      (mockCoursesService.findAll as unknown as Mock).mockResolvedValue(
        mockCourses,
      );

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
      (mockCoursesService.findUnique as unknown as Mock).mockResolvedValue(
        mockCourse,
      );

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
      } as unknown as CreateCourseRelationshipInput;

      const mockResult = {
        id: 'relationship-1',
        prerequisite: { id: 'block-1' },
        postrequisite: { id: 'block-2' },
        metadata: '{"type":"hard"}',
      };

      (
        mockCoursesService.createCourseRelationship as unknown as Mock
      ).mockResolvedValue(mockResult);

      const result = await resolver.createCourseRelationship(input);

      expect(result).toBe(mockResult);
      expect(
        mockCoursesService.createCourseRelationship as any,
      ).toHaveBeenCalledWith(input);
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

      (
        mockCoursesService.deleteCourseRelationship as unknown as Mock
      ).mockResolvedValue(mockResult);

      const result = await resolver.deleteCourseRelationship(input);

      expect(result).toBe(mockResult);
      expect(mockCoursesService.deleteCourseRelationship).toHaveBeenCalledWith(
        input,
      );
    });
  });

  describe('updateCourse', () => {
    it('delegates to service and returns course', async () => {
      const mockCourse = {
        id: 'c1',
        name: { en_text: 'A', he_text: 'א' },
      };
      (mockCoursesService.updateCourse as unknown as Mock).mockResolvedValue(
        mockCourse,
      );

      const result = await resolver.updateCourse({
        courseId: 'c1',
        enText: 'B',
      } as unknown as UpdateCourseInput);

      expect(result).toBe(mockCourse);
      expect(mockCoursesService.updateCourse as any).toHaveBeenCalledWith({
        courseId: 'c1',
        enText: 'B',
      });
    });
  });

  describe('setCourseModules', () => {
    it('delegates to service and returns course', async () => {
      const mockCourse = { id: 'c1', name: { en_text: 'A', he_text: 'א' } };
      (
        mockCoursesService.setCourseModules as unknown as Mock
      ).mockResolvedValue(mockCourse);

      const result = await resolver.setCourseModules({
        courseId: 'c1',
        moduleIds: ['m1', 'm2'],
      } as unknown as SetCourseModulesInput);

      expect(result).toBe(mockCourse);
      expect(mockCoursesService.setCourseModules as any).toHaveBeenCalledWith({
        courseId: 'c1',
        moduleIds: ['m1', 'm2'],
      });
    });
  });
});
