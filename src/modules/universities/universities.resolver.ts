import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { UniversitiesService } from './universities.service';
import { University } from './models/University.entity';
import { CreateUniversityInput } from './dto/create-university.input';
import { CreateManyUniversitiesInput } from './dto/create-many-universities.input';
import { UpdateUniversityInput } from './dto/update-university.input';
import { CreateManyResult } from '../common/create-many-result.type';

@Resolver(() => University)
export class UniversitiesResolver {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Query(() => [University], { name: 'universities' })
  async getUniversities(): Promise<University[]> {
    return this.universitiesService.findAll();
  }

  @Query(() => University, { name: 'university', nullable: true })
  async getUniversity(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<University | null> {
    return this.universitiesService.findUnique(id);
  }

  /**
   * Creates a new university.
   * @param input - The data for creating the university
   * @returns Promise<University> The newly created university
   */
  @Mutation(() => University, {
    name: 'createUniversity',
    description: 'Creates a new university',
  })
  async createUniversity(
    @Args('input') input: CreateUniversityInput,
  ): Promise<University> {
    return this.universitiesService.create(input);
  }

  /**
   * Creates multiple universities in bulk.
   * @param input - The data for creating the universities
   * @returns Promise<CreateManyResult> The result containing count of created universities
   */
  @Mutation(() => CreateManyResult, {
    name: 'createManyUniversities',
    description: 'Creates multiple universities in bulk',
  })
  async createManyUniversities(
    @Args('input') input: CreateManyUniversitiesInput,
  ): Promise<CreateManyResult> {
    return this.universitiesService.createMany(input);
  }

  @Mutation(() => University)
  updateUniversity(
    @Args('updateUniversityInput') updateUniversityInput: UpdateUniversityInput,
  ) {
    return this.universitiesService.update(
      updateUniversityInput.id,
      updateUniversityInput,
    );
  }

  @Mutation(() => University)
  removeUniversity(@Args('id', { type: () => ID }) id: string) {
    return this.universitiesService.remove(id);
  }
}
