import {
  Resolver,
  Query,
  Args,
  ID,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { FacultiesService } from './faculties.service';
import { Faculty } from './models/Faculty.entity';
import { Degree } from '../degrees/models/Degree.entity';
import { DegreesService } from '../degrees/degrees.service';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { CreateManyFacultiesInput } from './dto/create-many-faculties.input';
import { UpdateFacultyInput } from './dto/update-faculty.input';
import { CreateManyResult } from '../common/create-many-result.type';

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

  @Mutation(() => Faculty)
  createFaculty(
    @Args('createFacultyInput') createFacultyInput: CreateFacultyInput,
  ) {
    return this.facultiesService.create(createFacultyInput);
  }

  @Mutation(() => CreateManyResult, {
    name: 'createManyFaculties',
    description: 'Create multiple faculties in bulk',
  })
  createManyFaculties(
    @Args('input') input: CreateManyFacultiesInput,
  ): Promise<CreateManyResult> {
    return this.facultiesService.createMany(input);
  }

  @Query(() => [Faculty], { name: 'faculties' })
  findAll() {
    return this.facultiesService.findAll();
  }

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

  @Mutation(() => Faculty)
  updateFaculty(
    @Args('updateFacultyInput') updateFacultyInput: UpdateFacultyInput,
  ) {
    return this.facultiesService.update(
      updateFacultyInput.id,
      updateFacultyInput,
    );
  }

  @Mutation(() => Faculty)
  removeFaculty(@Args('id', { type: () => ID }) id: string) {
    return this.facultiesService.delete(id);
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
