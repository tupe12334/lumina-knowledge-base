import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { CoursesResolver } from './courses.resolver';
import { CoursesService } from './courses.service';
import { CreateCourseRelationshipInput } from './dto/create-course-relationship.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { SetCourseModulesInput } from './dto/set-course-modules.input';
import { ModulesService } from '../modules/modules.service';

// Test setup helpers
const createMockServices = () => {
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
  } satisfies Partial<ModulesService>;

  return { mockCoursesService, mockModulesService };
};

const setupResolver = (mockCoursesService: unknown, mockModulesService: ModulesService) => {
  return new CoursesResolver(
    mockCoursesService satisfies Partial<CoursesService>,
    mockModulesService,
  );
};

describe('CoursesResolver', () => {
  let resolver: CoursesResolver;
  let mockCoursesService: ReturnType<typeof createMockServices>['mockCoursesService'];
  let mockModulesService: ModulesService;

  beforeEach(() => {
    const services = createMockServices();
    mockCoursesService = services.mockCoursesService;
    mockModulesService = services.mockModulesService satisfies ModulesService;
    resolver = setupResolver(mockCoursesService, mockModulesService);
  });

  describe('getCourses', () => {
    it('should return all courses', async () => {
      const mockCourses = [
        {
          id: '1',
          name: { en_text: 'Course 1', he_text: 'קורס 1' },
        },
      ];
      vi.mocked(mockCoursesService.findAll).mockResolvedValue(mockCourses);

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
      vi.mocked(mockCoursesService.findUnique).mockResolvedValue(mockCourse);

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
      } satisfies CreateCourseRelationshipInput;

      const mockResult = {
        id: 'relationship-1',
        prerequisite: { id: 'block-1' },
        postrequisite: { id: 'block-2' },
        metadata: '{"type":"hard"}',
      };

      vi.mocked(mockCoursesService.createCourseRelationship).mockResolvedValue(mockResult);

      const result = await resolver.createCourseRelationship(input);

      expect(result).toBe(mockResult);
      expect(mockCoursesService.createCourseRelationship).toHaveBeenCalledWith(input);
    });
  });

  describe('updateCourse', () => {
    it('delegates to service and returns course', async () => {
      const mockCourse = {
        id: 'c1',
        name: { en_text: 'A', he_text: 'א' },
      };
      vi.mocked(mockCoursesService.updateCourse).mockResolvedValue(mockCourse);

      const result = await resolver.updateCourse({
        courseId: 'c1',
        enText: 'B',
      } satisfies UpdateCourseInput);

      expect(result).toBe(mockCourse);
      expect(mockCoursesService.updateCourse).toHaveBeenCalledWith({
        courseId: 'c1',
        enText: 'B',
      });
    });
  });

  describe('setCourseModules', () => {
    it('delegates to service and returns course', async () => {
      const mockCourse = { id: 'c1', name: { en_text: 'A', he_text: 'א' } };
      vi.mocked(mockCoursesService.setCourseModules).mockResolvedValue(mockCourse);

      const result = await resolver.setCourseModules({
        courseId: 'c1',
        moduleIds: ['m1', 'm2'],
      } satisfies SetCourseModulesInput);

      expect(result).toBe(mockCourse);
      expect(mockCoursesService.setCourseModules).toHaveBeenCalledWith({
        courseId: 'c1',
        moduleIds: ['m1', 'm2'],
      });
    });
  });
});
