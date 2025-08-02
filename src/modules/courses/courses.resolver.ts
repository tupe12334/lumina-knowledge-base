import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from './models/Course.entity';

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
}
