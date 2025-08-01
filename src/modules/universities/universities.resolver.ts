import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UniversitiesService } from './universities.service';
import { University } from './models/University.entity';

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
}
