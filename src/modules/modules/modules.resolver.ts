import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { ModulesService } from './modules.service';
import { Module } from './models/Module.entity';
import { ModulesQueryInput } from './dto/modules-query.input';

/**
 * GraphQL resolver for module-related operations.
 * Provides GraphQL queries for retrieving module information.
 */
@Resolver(() => Module)
export class ModulesResolver {
  constructor(private readonly modulesService: ModulesService) {}

  /**
   * Retrieves all modules from the system with optional filtering.
   * @param input - Optional filtering parameters
   * @returns Promise<Module[]> Array of all modules with their related data
   */
  @Query(() => [Module], {
    name: 'modules',
    description: 'Get all modules with optional filtering',
  })
  async getModules(
    @Args('input', { type: () => ModulesQueryInput, nullable: true })
    input?: ModulesQueryInput,
  ): Promise<Module[]> {
    return this.modulesService.findAll(input);
  }

  /**
   * Retrieves a specific module by its ID.
   * @param id - The unique identifier of the module
   * @returns Promise<Module | null> The module if found, null otherwise
   */
  @Query(() => Module, {
    name: 'module',
    nullable: true,
    description: 'Get a specific module by ID',
  })
  async getModule(
    @Args('id', { type: () => ID, description: 'Module ID' }) id: string,
  ): Promise<Module | null> {
    return this.modulesService.findUnique(id);
  }
}
