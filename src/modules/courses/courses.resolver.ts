import {
  Resolver,
  Query,
  Args,
  ID,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CoursesService } from './courses.service';
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
import { CreateManyResult } from '../common/create-many-result.type';
import { ModulesService } from '../modules/modules.service'; // Added import
import { Module } from '../modules/models/Module.entity'; // Added import

/**
 * GraphQL resolver for course-related operations.
 * Provides GraphQL queries for retrieving course information.
 */
@Resolver(() => Course)
export class CoursesResolver {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly modulesService: ModulesService, // Injected ModulesService
  ) {}

  @ResolveField(() => [Module], {
    name: 'modules',
    description: 'Modules associated with this course',
  })
  async modules(@Parent() course: Course): Promise<Module[]> {
    return this.modulesService.findModulesByCourseId(course.id);
  }

  @Mutation(() => Course, {
    name: 'createCourse',
    description: 'Create a new course',
  })
  createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ): Promise<Course> {
    return this.coursesService.create(createCourseInput);
  }

  @Mutation(() => CreateManyResult, {
    name: 'createManyCourses',
    description: 'Create multiple courses in bulk',
  })
  createManyCourses(
    @Args('input') input: CreateManyCoursesInput,
  ): Promise<CreateManyResult> {
    return this.coursesService.createMany(input);
  }

  /**
   * Retrieves all courses from the system.
   * @returns Promise<Course[]> Array of all courses with their related data
   */
  @Query(() => [Course], {
    name: 'courses',
    description: 'Get all courses',
  })
  async getCourses(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  /**
   * Retrieves a specific course by its ID.
   * @param id - The unique identifier of the course
   * @returns Promise<Course | null> The course if found, null otherwise
   */
  @Query(() => Course, {
    name: 'course',
    nullable: true,
    description: 'Get a specific course by ID',
  })
  async getCourse(
    @Args('id', { type: () => ID, description: 'Course ID' }) id: string,
  ): Promise<Course | null> {
    return this.coursesService.findUnique(id);
  }

  /**
   * Creates a prerequisite/postrequisite relationship between two courses.
   * @param input - The relationship creation data
   * @returns Promise<CourseRelationshipResult> The result of the operation
   */
  @Mutation(() => CourseRelationshipResult, {
    name: 'createCourseRelationship',
    description:
      'Create a prerequisite/postrequisite relationship between courses',
  })
  async createCourseRelationship(
    @Args('input') input: CreateCourseRelationshipInput,
  ): Promise<CourseRelationshipResult> {
    return this.coursesService.createCourseRelationship(input);
  }

  /**
   * Deletes a prerequisite/postrequisite relationship between two courses.
   * @param input - The relationship deletion data
   * @returns Promise<CourseRelationshipResult> The result of the operation
   */
  @Mutation(() => CourseRelationshipResult, {
    name: 'deleteCourseRelationship',
    description:
      'Delete a prerequisite/postrequisite relationship between courses',
  })
  async deleteCourseRelationship(
    @Args('input') input: DeleteCourseRelationshipInput,
  ): Promise<CourseRelationshipResult> {
    return this.coursesService.deleteCourseRelationship(input);
  }

  /**
   * Deletes a course and cleans up all related data from the database.
   * This is a destructive operation that will remove:
   * - The course itself
   * - All course relationships (prerequisites/postrequisites)
   * - Orphaned modules (modules only used by this course)
   * - Questions associated with orphaned modules
   
   * - Translation data that becomes unused
   * @param input - The course deletion data
   * @returns Promise<DeleteCourseResult> The result of the deletion operation
   */
  @Mutation(() => DeleteCourseResult, {
    name: 'deleteCourse',
    description:
      'Delete a course and clean up all related data from the database',
  })
  async deleteCourse(
    @Args('input') input: DeleteCourseInput,
  ): Promise<DeleteCourseResult> {
    return this.coursesService.deleteCourse(input);
  }

  /**
   * Updates a course fields. Supports updating translation texts and other optional fields.
   */
  @Mutation(() => Course, {
    name: 'updateCourse',
    description:
      "Update a course's fields (e.g., name translation, institution, publishedAt)",
  })
  updateCourse(@Args('input') input: UpdateCourseInput): Promise<Course> {
    return this.coursesService.updateCourse(input);
  }

  /**
   * Sets course modules (replaces existing assignments)
   */
  @Mutation(() => Course, {
    name: 'setCourseModules',
    description: "Replace a course's modules with the provided module IDs",
  })
  setCourseModules(
    @Args('input') input: SetCourseModulesInput,
  ): Promise<Course> {
    return this.coursesService.setCourseModules(input);
  }
}
