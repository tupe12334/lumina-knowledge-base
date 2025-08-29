import {
  Resolver,
  Query,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { FacultiesService } from './faculties.service';
import { Faculty } from './models/Faculty.entity';
import { Degree } from '../degrees/models/Degree.entity';
import { DegreesService } from '../degrees/degrees.service';

/**
 * GraphQL resolver for faculty-related operations.
 * Provides GraphQL queries for retrieving faculty information.
 */
@Resolver(() => Faculty)
export class FacultiesResolver {
  constructor(
    private readonly facultiesService: FacultiesService,
    private readonly degreesService: DegreesService,
  ) {}

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
    return this.facultiesService.getFacultiesByInstitution(universityId);
  }

  /**
   * Field resolver to fetch degrees for a Faculty.
   */
  @ResolveField(() => [Degree], { name: 'degrees' })
  async getDegrees(@Parent() faculty: Faculty): Promise<Degree[]> {
    if (!faculty?.id) return [];
    return this.degreesService.findByFacultyId(faculty.id);
  }
}
