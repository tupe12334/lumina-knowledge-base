import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { DegreesService } from './degrees.service';
import { Degree } from './models/Degree.entity';
import { DegreesQueryDto } from './dto/degrees-query.dto';

/**
 * GraphQL resolver for degree-related operations.
 * Provides GraphQL queries for retrieving degree information.
 */
@Resolver(() => Degree)
export class DegreesResolver {
  constructor(private readonly degreesService: DegreesService) {}

  /**
   * Retrieves all degrees with optional filtering.
   * @param query - Optional filtering parameters
   * @returns Promise<Degree[]> Array of degrees matching the criteria
   */
  @Query(() => [Degree], {
    name: 'degrees',
    description: 'Get all degrees with optional filtering',
  })
  async getDegrees(
    @Args('query', { type: () => DegreesQueryDto, nullable: true })
    query?: DegreesQueryDto,
  ): Promise<Degree[]> {
    return this.degreesService.findAll(query);
  }

  /**
   * Retrieves a specific degree by its ID.
   * @param id - The unique identifier of the degree
   * @returns Promise<Degree | null> The degree if found, null otherwise
   */
  @Query(() => Degree, {
    name: 'degree',
    nullable: true,
    description: 'Get a specific degree by ID',
  })
  async getDegree(
    @Args('id', { type: () => ID, description: 'Degree ID' }) id: string,
  ): Promise<Degree | null> {
    return this.degreesService.findUnique(id);
  }

  /**
   * Retrieves all degrees for a specific university.
   * @param universityId - The unique identifier of the university
   * @returns Promise<Degree[]> Array of degrees for the specified university
   */
  @Query(() => [Degree], {
    name: 'degreesByUniversity',
    description: 'Get degrees by university ID',
  })
  async getDegreesByUniversity(
    @Args('universityId', { type: () => ID, description: 'University ID' })
    universityId: string,
  ): Promise<Degree[]> {
    return this.degreesService.findByUniversityId(universityId);
  }
}
