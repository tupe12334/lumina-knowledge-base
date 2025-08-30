import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DegreesService } from './degrees.service';
import { Degree } from './models/Degree.entity';
import { SetDegreeFacultyInput } from './dto/set-degree-faculty.input';

/**
 * GraphQL resolver for degree-related operations.
 * Provides GraphQL mutations for degree management.
 */
@Resolver(() => Degree)
export class DegreesResolver {
  constructor(private readonly degreesService: DegreesService) {}

  /**
   * Sets or clears the faculty for a degree.
   * @param input - Degree ID and optional faculty ID (null to clear)
   * @returns The updated degree
   */
  @Mutation(() => Degree, {
    name: 'setDegreeFaculty',
    description:
      'Assign a faculty to a degree or clear the assignment when facultyId is null',
  })
  async setDegreeFaculty(
    @Args('input', { type: () => SetDegreeFacultyInput })
    input: SetDegreeFacultyInput,
  ): Promise<Degree> {
    const { degreeId, facultyId } = input;
    return this.degreesService.setFacultyForDegree(
      degreeId,
      facultyId !== null && facultyId !== undefined ? facultyId : null,
    );
  }
}
