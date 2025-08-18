import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { DegreesService } from './degrees.service';
import { Degree } from './models/Degree.entity';
import { DegreesQueryDto } from './dto/degrees-query.dto';
import { SetDegreeFacultyInput } from './dto/set-degree-faculty.input';
import { AddCourseToDegreeInput } from './dto/add-course-to-degree.input';
import { CreateDegreeInput } from './dto/create-degree.input';
import { UpdateDegreeInput } from './dto/update-degree.input';

/**
 * GraphQL resolver for degree-related operations.
 * Provides GraphQL queries for retrieving degree information.
 */
@Resolver(() => Degree)
export class DegreesResolver {
  constructor(private readonly degreesService: DegreesService) {}

  @Mutation(() => Degree)
  createDegree(
    @Args('createDegreeInput') createDegreeInput: CreateDegreeInput,
  ) {
    return this.degreesService.create(createDegreeInput);
  }

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

  @Mutation(() => Degree)
  updateDegree(
    @Args('updateDegreeInput') updateDegreeInput: UpdateDegreeInput,
  ) {
    return this.degreesService.update(updateDegreeInput.id, updateDegreeInput);
  }

  @Mutation(() => Degree)
  removeDegree(@Args('id', { type: () => ID }) id: string) {
    return this.degreesService.delete(id);
  }

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
    return this.degreesService.setFacultyForDegree(degreeId, facultyId ?? null);
  }

  /**
   * Adds a course to a degree.
   * @param input - The data for adding the course to the degree
   * @returns Promise<Degree> The updated degree
   */
  @Mutation(() => Degree, {
    name: 'addCourseToDegree',
    description: 'Adds a course to a degree',
  })
  async addCourseToDegree(
    @Args('input') input: AddCourseToDegreeInput,
  ): Promise<Degree> {
    const { courseId, degreeId } = input;
    return this.degreesService.addCourse(degreeId, courseId);
  }
}
