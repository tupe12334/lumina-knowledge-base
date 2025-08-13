import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from './models/Course.entity';
import { CreateCourseRelationshipInput } from './dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from './dto/delete-course-relationship.input';
import { CourseRelationshipResult } from './dto/course-relationship-result.type';

/**
 * GraphQL resolver for course-related operations.
 * Provides GraphQL queries for retrieving course information.
 */
@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

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
}
