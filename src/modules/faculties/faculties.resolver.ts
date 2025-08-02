import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { FacultiesService } from './faculties.service';
import { Faculty } from './models/Faculty.entity';

/**
 * GraphQL resolver for faculty-related operations.
 * Provides GraphQL queries for retrieving faculty information.
 */
@Resolver(() => Faculty)
export class FacultiesResolver {
  constructor(private readonly facultiesService: FacultiesService) {}

  /**
   * Retrieves faculties for a specific university.
   * @param universityId - The unique identifier of the university
   * @returns Promise<Faculty[]> Array of faculties for the specified university
   */
  @Query(() => [Faculty], {
    name: 'facultiesByUniversity',
    description: 'Get faculties by university ID',
  })
  async getFacultiesByUniversity(
    @Args('universityId', { type: () => ID, description: 'University ID' })
    universityId: string,
  ): Promise<Faculty[]> {
    return this.facultiesService.getFacultiesByUniversity(universityId);
  }

  /**
   * Retrieves a specific faculty by its ID.
   * @param id - The unique identifier of the faculty
   * @returns Promise<Faculty | null> The faculty if found, null otherwise
   */
  @Query(() => Faculty, {
    name: 'faculty',
    nullable: true,
    description: 'Get a specific faculty by ID',
  })
  async getFaculty(
    @Args('id', { type: () => ID, description: 'Faculty ID' }) id: string,
  ): Promise<Faculty | null> {
    return this.facultiesService.getFacultyById(id);
  }
}
