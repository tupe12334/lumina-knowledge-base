import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { DegreesService } from './degrees.service';
import { Degree } from './models/Degree.entity';

@Resolver(() => Degree)
export class DegreesResolver {
  constructor(private readonly degreesService: DegreesService) {}

  @Query(() => [Degree], { name: 'degrees' })
  async getDegrees(): Promise<Degree[]> {
    return this.degreesService.findAll();
  }

  @Query(() => Degree, { name: 'degree', nullable: true })
  async getDegree(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Degree | null> {
    return this.degreesService.findUnique(id);
  }

  @Query(() => [Degree], { name: 'degreesByUniversity' })
  async getDegreesByUniversity(
    @Args('universityId', { type: () => ID }) universityId: string,
  ): Promise<Degree[]> {
    return this.degreesService.findByUniversityId(universityId);
  }

  @Query(() => [Degree], { name: 'degreesByUniversityAndDiscipline' })
  async getDegreesByUniversityAndDiscipline(
    @Args('universityId', { type: () => ID }) universityId: string,
    @Args('disciplineId', { type: () => ID }) disciplineId: string,
  ): Promise<Degree[]> {
    return this.degreesService.findByUniversityIdAndDisciplineId(
      universityId,
      disciplineId,
    );
  }
}
