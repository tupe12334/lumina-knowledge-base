import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { InstitutionsService } from './institutions.service';
import { Institution } from './models/Institution.entity';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { CreateManyInstitutionsInput } from './dto/create-many-institutions.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';
import { CreateManyResult } from '../common/create-many-result.type';

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

  /**
   * Creates a new university.
   * @param input - The data for creating the university
   * @returns Promise<University> The newly created university
   */
  @Mutation(() => Institution, {
    name: 'createUniversity',
    description: 'Creates a new university',
  })
  async createUniversity(
    @Args('input') input: CreateInstitutionInput,
  ): Promise<Institution> {
    return this.institutionsService.create(input);
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
    @Args('input') input: CreateManyInstitutionsInput,
  ): Promise<CreateManyResult> {
    return this.institutionsService.createMany(input);
  }

  @Mutation(() => Institution)
  updateUniversity(
    @Args('updateUniversityInput') updateUniversityInput: UpdateInstitutionInput,
  ) {
    return this.institutionsService.update(
      updateUniversityInput.id,
      updateUniversityInput,
    );
  }

  @Mutation(() => Institution)
  removeUniversity(@Args('id', { type: () => ID }) id: string) {
    return this.institutionsService.remove(id);
  }
}
