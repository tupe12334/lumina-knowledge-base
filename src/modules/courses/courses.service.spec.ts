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
import { CourseRelationshipService } from './services/course-relationship.service';
import { CourseDeletionService } from './services/course-deletion.service';
import { CourseSummaryService } from './services/course-summary.service';
import { CourseUpdateService } from './services/course-update.service';
import { CourseCreationService } from './services/course-creation.service';
import { CourseQueryService } from './services/course-query.service';
import { CourseModuleService } from './services/course-module.service';

// Test helpers
const createMockPrismaService = (): Partial<PrismaService> => ({
  course: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  blockRelationship: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
});

const createMockCourseRelationshipService = (): Partial<CourseRelationshipService> => ({
  createCourseRelationship: vi.fn(),
  deleteCourseRelationship: vi.fn(),
});

const createMockCourseDeletionService = (): Partial<CourseDeletionService> => ({
  deleteCourse: vi.fn(),
});

const createMockCourseSummaryService = (): Partial<CourseSummaryService> => ({
  generateSummary: vi.fn(),
});

const createMockCourseUpdateService = (): Partial<CourseUpdateService> => ({
  updateCourse: vi.fn(),
});

const createMockCourseModuleService = (): Partial<CourseModuleService> => ({
  setCourseModules: vi.fn(),
});

const createMockCourseCreationService = (): Partial<CourseCreationService> => ({
  create: vi.fn(),
  createMany: vi.fn(),
});

const createMockCourseQueryService = (): Partial<CourseQueryService> => ({
  findAll: vi.fn(),
  findUnique: vi.fn(),
});

const createServiceForTests = (
  mockPrisma: ReturnType<typeof createMockPrismaService>,
  mockCourseRelationshipService: ReturnType<typeof createMockCourseRelationshipService> = createMockCourseRelationshipService(),
  mockCourseDeletionService: ReturnType<typeof createMockCourseDeletionService> = createMockCourseDeletionService(),
  mockCourseSummaryService: ReturnType<typeof createMockCourseSummaryService> = createMockCourseSummaryService(),
  mockCourseUpdateService: ReturnType<typeof createMockCourseUpdateService> = createMockCourseUpdateService(),
  mockCourseModuleService: ReturnType<typeof createMockCourseModuleService> = createMockCourseModuleService(),
  mockCourseCreationService: ReturnType<typeof createMockCourseCreationService> = createMockCourseCreationService(),
  mockCourseQueryService: ReturnType<typeof createMockCourseQueryService> = createMockCourseQueryService()
) => {
  // @ts-expect-error - Mocking services for tests
  return new CoursesService(
    mockPrisma,
    mockCourseRelationshipService,
    mockCourseDeletionService,
    mockCourseSummaryService,
    mockCourseUpdateService,
    mockCourseModuleService,
    mockCourseCreationService,
    mockCourseQueryService
  );
};

const createBasicCourseTests = (
  service: CoursesService,
  mockPrisma: ReturnType<typeof createMockPrismaService>,
  mockCourseQueryService: ReturnType<typeof createMockCourseQueryService>
) => ({
  testReturnsCoursesFromPrisma: async () => {
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
    mockCourseQueryService.findAll.mockResolvedValue([course]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name.en_text).toBe('course');
    expect(result[0].institution).toBeDefined();
    expect(result[0].institution!.name.en_text).toBe('institution');
  },
});


// Shared test setup
const setupTestsForCoursesService = () => {
  let service: CoursesService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;
  let mockCourseRelationshipService: ReturnType<typeof createMockCourseRelationshipService>;
  let mockCourseDeletionService: ReturnType<typeof createMockCourseDeletionService>;
  let mockCourseSummaryService: ReturnType<typeof createMockCourseSummaryService>;
  let mockCourseUpdateService: ReturnType<typeof createMockCourseUpdateService>;
  let mockCourseCreationService: ReturnType<typeof createMockCourseCreationService>;
  let mockCourseQueryService: ReturnType<typeof createMockCourseQueryService>;
  let basicTests: ReturnType<typeof createBasicCourseTests>;

  beforeEach(() => {
    mockPrismaService = createMockPrismaService();
    mockCourseRelationshipService = createMockCourseRelationshipService();
    mockCourseDeletionService = createMockCourseDeletionService();
    mockCourseSummaryService = createMockCourseSummaryService();
    mockCourseUpdateService = createMockCourseUpdateService();
    mockCourseCreationService = createMockCourseCreationService();
    mockCourseQueryService = createMockCourseQueryService();
    const mockModuleService = createMockCourseModuleService();
    service = createServiceForTests(
      mockPrismaService,
      mockCourseRelationshipService,
      mockCourseDeletionService,
      mockCourseSummaryService,
      mockCourseUpdateService,
      mockModuleService,
      mockCourseCreationService,
      mockCourseQueryService
    );
    basicTests = createBasicCourseTests(service, mockPrismaService, mockCourseQueryService);
  });

  return {
    getService: () => service,
    getMockPrisma: () => mockPrismaService,
    getMockCourseRelationshipService: () => mockCourseRelationshipService,
    getMockCourseDeletionService: () => mockCourseDeletionService,
    getMockCourseSummaryService: () => mockCourseSummaryService,
    getMockCourseUpdateService: () => mockCourseUpdateService,
    getMockCourseCreationService: () => mockCourseCreationService,
    getMockCourseQueryService: () => mockCourseQueryService,
    getBasicTests: () => basicTests
  };
};

describe('CoursesService - Basic Operations', () => {
  const { getService, getBasicTests } = setupTestsForCoursesService();

  it('returns courses from prisma', async () => {
    await getBasicTests().testReturnsCoursesFromPrisma();
  });
});

describe('CoursesService - generateSummary', () => {
  const { getService, getMockCourseSummaryService } = setupTestsForCoursesService();

  it('should generate a comprehensive course summary', async () => {
    const expectedSummary = `Course: Introduction to Computer Science
ID: course-123
Institution: Harvard University
Associated Degrees: Bachelor of CS
Modules: 2 modules - Algorithms, Data Structures
Prerequisites: None
Postrequisites: None`;

    getMockCourseSummaryService().generateSummary.mockResolvedValue(expectedSummary);

    const result = await getService().generateSummary('course-123');

    expect(getMockCourseSummaryService().generateSummary).toHaveBeenCalledWith('course-123');
    expect(result).toBe(expectedSummary);
  });

  it('should handle course with no blocks', async () => {
    const expectedSummary = `Course: Simple Course
ID: course-456
Institution: Small College
Associated Degrees: None
Modules: 0 modules - None
Prerequisites: None
Postrequisites: None`;

    getMockCourseSummaryService().generateSummary.mockResolvedValue(expectedSummary);

    const result = await getService().generateSummary('course-456');

    expect(getMockCourseSummaryService().generateSummary).toHaveBeenCalledWith('course-456');
    expect(result).toBe(expectedSummary);
  });

  it('should throw NotFoundException when course does not exist', async () => {
    getMockCourseSummaryService().generateSummary.mockRejectedValue(
      new NotFoundException('Course with ID non-existent not found')
    );

    await expect(getService().generateSummary('non-existent')).rejects.toThrow(
      NotFoundException,
    );
    await expect(getService().generateSummary('non-existent')).rejects.toThrow(
      'Course with ID non-existent not found',
    );
  });

  it('should throw InternalServerErrorException on database error', async () => {
    getMockCourseSummaryService().generateSummary.mockRejectedValue(
      new InternalServerErrorException('Failed to generate course summary: Database connection failed')
    );

    await expect(getService().generateSummary('course-123')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(getService().generateSummary('course-123')).rejects.toThrow(
      'Failed to generate course summary',
    );
  });
});

describe('CoursesService - createCourseRelationship', () => {
  const { getService, getMockCourseRelationshipService } = setupTestsForCoursesService();

  it('should create a relationship between two courses', async () => {
    const input: CreateCourseRelationshipInput = {
      prerequisiteCourseId: 'course-1',
      postrequisiteCourseId: 'course-2',
      metadata: { type: 'hard' },
    };

    const expectedResult = {
      id: 'relationship-1',
      prerequisite: { id: 'block-1' },
      postrequisite: { id: 'block-2' },
      metadata: '{"TYPE":"hard"}',
    };

    getMockCourseRelationshipService().createCourseRelationship.mockResolvedValue(expectedResult);

    const result = await getService().createCourseRelationship(input);

    expect(getMockCourseRelationshipService().createCourseRelationship).toHaveBeenCalledWith(input);
    expect(result.id).toBe('relationship-1');
    expect(result.metadata).toBe('{"TYPE":"hard"}');
  });

  it('should throw BadRequestException if same course is used for both prerequisite and postrequisite', async () => {
    const input: CreateCourseRelationshipInput = {
      prerequisiteCourseId: 'course-1',
      postrequisiteCourseId: 'course-1',
    };

    getMockCourseRelationshipService().createCourseRelationship.mockRejectedValue(
      new BadRequestException('A course cannot be a prerequisite to itself')
    );

    await expect(getService().createCourseRelationship(input)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw NotFoundException if prerequisite course does not exist', async () => {
    const input: CreateCourseRelationshipInput = {
      prerequisiteCourseId: 'non-existent',
      postrequisiteCourseId: 'course-2',
    };

    getMockCourseRelationshipService().createCourseRelationship.mockRejectedValue(
      new NotFoundException('Prerequisite course with ID non-existent not found')
    );

    await expect(getService().createCourseRelationship(input)).rejects.toThrow(
      NotFoundException,
    );
  });
});

describe('CoursesService - deleteCourseRelationship', () => {
  const { getService, getMockCourseRelationshipService } = setupTestsForCoursesService();

  it('should delete a relationship between two courses', async () => {
    const input: DeleteCourseRelationshipInput = {
      prerequisiteCourseId: 'course-1',
      postrequisiteCourseId: 'course-2',
    };

    const expectedResult = {
      id: 'relationship-1',
      prerequisite: { id: 'block-1' },
      postrequisite: { id: 'block-2' },
      metadata: '{"TYPE":"hard"}',
    };

    getMockCourseRelationshipService().deleteCourseRelationship.mockResolvedValue(expectedResult);

    const result = await getService().deleteCourseRelationship(input);

    expect(getMockCourseRelationshipService().deleteCourseRelationship).toHaveBeenCalledWith(input);
    expect(result.id).toBe('relationship-1');
    expect(result.metadata).toBe('{"TYPE":"hard"}');
  });

  it('should throw NotFoundException if relationship does not exist', async () => {
    const input: DeleteCourseRelationshipInput = {
      prerequisiteCourseId: 'course-1',
      postrequisiteCourseId: 'course-2',
    };

    getMockCourseRelationshipService().deleteCourseRelationship.mockRejectedValue(
      new NotFoundException('Relationship not found between these courses')
    );

    await expect(getService().deleteCourseRelationship(input)).rejects.toThrow(
      NotFoundException,
    );
  });
});
