import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { UniversitiesService } from './universities.service';
import { University } from './models/University.entity';
import { CreateUniversityInput } from './dto/create-university.input';

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
}
