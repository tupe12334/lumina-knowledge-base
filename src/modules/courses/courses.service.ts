import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Course } from './models/Course.entity';
import { CreateCourseRelationshipInput } from './dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from './dto/delete-course-relationship.input';
import { CourseRelationshipResult } from './dto/course-relationship-result.type';
import { DeleteCourseInput } from './dto/delete-course.input';
import { DeleteCourseResult } from './dto/delete-course-result.type';
import { UpdateCourseInput } from './dto/update-course.input';
import { SetCourseModulesInput } from './dto/set-course-modules.input';
import { CreateCourseInput } from './dto/create-course.input';
import { CreateManyCoursesInput } from './dto/create-many-courses.input';
import { CoursesQueryInput } from './dto/courses-query.input';
import { CourseRelationshipService } from './services/course-relationship.service';
import { CourseDeletionService } from './services/course-deletion.service';
import { CourseSummaryService } from './services/course-summary.service';
import { CourseUpdateService } from './services/course-update.service';
import { CourseModuleService } from './services/course-module.service';
import { CourseCreationService } from './services/course-creation.service';
import { CourseQueryService } from './services/course-query.service';



@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseRelationshipService: CourseRelationshipService,
    private readonly courseDeletionService: CourseDeletionService,
    private readonly courseSummaryService: CourseSummaryService,
    private readonly courseUpdateService: CourseUpdateService,
    private readonly courseModuleService: CourseModuleService,
    private readonly courseCreationService: CourseCreationService,
    private readonly courseQueryService: CourseQueryService,
  ) {}

  async create(createCourseInput: CreateCourseInput): Promise<Course> {
    return this.courseCreationService.create(createCourseInput);
  }

  /**
   * Creates multiple courses in a single transaction.
   * @param input - The data for creating multiple courses
   * @returns The number of courses created
   */
  async createMany(input: CreateManyCoursesInput) {
    return this.courseCreationService.createMany(input);
  }

  async findAll(query?: CoursesQueryInput): Promise<Course[]> {
    return this.courseQueryService.findAll(query);
  }

  async findUnique(id: string): Promise<Course | null> {
    return this.courseQueryService.findUnique(id);
  }

  /**
   * Creates a prerequisite/postrequisite relationship between two courses.
   * @param relationshipData - The relationship data containing course IDs and optional metadata
   * @returns The created relationship with full details
   */
  async createCourseRelationship(
    relationshipData: CreateCourseRelationshipInput,
  ): Promise<CourseRelationshipResult> {
    return this.courseRelationshipService.createCourseRelationship(relationshipData);
  }

  /**
   * Deletes a prerequisite/postrequisite relationship between two courses.
   * @param relationshipData - The relationship data containing course IDs
   * @returns The deleted relationship with full details
   */
  async deleteCourseRelationship(
    relationshipData: DeleteCourseRelationshipInput,
  ): Promise<CourseRelationshipResult> {
    return this.courseRelationshipService.deleteCourseRelationship(relationshipData);
  }

  /**
   * Deletes a course and cleans up all related data from the database.
   * This includes:
   * - Course relationships (prerequisites/postrequisites)
   * - Module relationships
   * - Questions associated with course modules
   * - Translation data
   * @param deleteData - The course deletion data containing course ID
   * @returns The deletion result with cleanup details
   */
  async deleteCourse(
    deleteData: DeleteCourseInput,
  ): Promise<DeleteCourseResult> {
    return this.courseDeletionService.deleteCourse(deleteData);
  }


  /**
   * Generic course update supporting translation and optional fields.
   * If no updatable fields are provided, throws BadRequest.
   */
  async updateCourse(input: UpdateCourseInput): Promise<Course> {
    return this.courseUpdateService.updateCourse(input);
  }

  /**
   * Sets the modules of a course, replacing any existing assignments.
   */
  async setCourseModules(input: SetCourseModulesInput): Promise<Course> {
    return this.courseModuleService.setCourseModules(input);
  }

  /**
   * Generates a human-readable summary of a course including its university, degrees, modules, and prerequisites.
   * @param id - The course ID
   * @returns A plain text summary of the course
   * @throws NotFoundException if the course doesn't exist
   * @throws InternalServerErrorException if database operation fails
   */
  async generateSummary(id: string): Promise<string> {
    return this.courseSummaryService.generateSummary(id);
  }
}
