import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { InstitutionsService } from './institutions.service';
import { Institution } from './models/Institution.entity';

@Resolver(() => Institution)
export class InstitutionsResolver {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Query(() => [Institution], { name: 'universities' })
  async getUniversities(): Promise<Institution[]> {
    return this.institutionsService.findAll();
  }

  @Query(() => Institution, { name: 'university', nullable: true })
  async getUniversity(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Institution | null> {
    return this.institutionsService.findUnique(id);
  }

}
