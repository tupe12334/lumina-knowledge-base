import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { LearningResourcesService } from './learning-resources.service';
import { LearningResource } from './models/LearningResource.entity';

/**
 * GraphQL resolver for learning resource-related operations.
 * Provides GraphQL queries for retrieving learning resource information.
 */
@Resolver(() => LearningResource)
export class LearningResourcesResolver {
  constructor(
    private readonly learningResourcesService: LearningResourcesService,
  ) {}

  /**
   * Retrieves all learning resources from the system.
   * @returns Promise<LearningResource[]> Array of all learning resources
   */
  @Query(() => [LearningResource], {
    name: 'learningResources',
    description: 'Get all learning resources',
  })
  async getLearningResources(): Promise<LearningResource[]> {
    return this.learningResourcesService.findAll();
  }

  /**
   * Retrieves a specific learning resource by its ID.
   * @param id - The unique identifier of the learning resource
   * @returns Promise<LearningResource | null> The learning resource if found, null otherwise
   */
  @Query(() => LearningResource, {
    name: 'learningResource',
    nullable: true,
    description: 'Get a specific learning resource by ID',
  })
  async getLearningResource(
    @Args('id', { type: () => ID, description: 'Learning Resource ID' })
    id: string,
  ): Promise<LearningResource | null> {
    return this.learningResourcesService.findUnique(id);
  }

  /**
   * Retrieves learning resources for a specific module.
   * @param moduleId - The unique identifier of the module
   * @returns Promise<LearningResource[]> Array of learning resources for the specified module
   */
  @Query(() => [LearningResource], {
    name: 'learningResourcesByModule',
    description: 'Get learning resources by module ID',
  })
  async getLearningResourcesByModule(
    @Args('moduleId', { type: () => ID, description: 'Module ID' })
    moduleId: string,
  ): Promise<LearningResource[]> {
    return this.learningResourcesService.findByModuleId(moduleId);
  }
}
