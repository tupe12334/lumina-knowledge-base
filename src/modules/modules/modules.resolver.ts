import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { ModulesService } from './modules.service';
import { Module } from './models/Module.entity';
import { ModulesQueryInput } from './dto/modules-query.input';
import { CreateModuleRelationshipInput } from './dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from './dto/delete-module-relationship.input';
import { ModuleRelationshipResult } from './dto/module-relationship-result.type';
import { CreateModuleInput } from './dto/create-module.input';

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

  /**
   * Creates a prerequisite/postrequisite relationship between two modules.
   * @param input - The relationship creation data
   * @returns Promise<ModuleRelationshipResult> The result of the operation
   */
  @Mutation(() => ModuleRelationshipResult, {
    name: 'createModuleRelationship',
    description:
      'Create a prerequisite/postrequisite relationship between modules',
  })
  async createModuleRelationship(
    @Args('input') input: CreateModuleRelationshipInput,
  ): Promise<ModuleRelationshipResult> {
    return this.modulesService.createModuleRelationship(input);
  }

  /**
   * Deletes a prerequisite/postrequisite relationship between two modules.
   * @param input - The relationship deletion data
   * @returns Promise<ModuleRelationshipResult> The result of the operation
   */
  @Mutation(() => ModuleRelationshipResult, {
    name: 'deleteModuleRelationship',
    description:
      'Delete a prerequisite/postrequisite relationship between modules',
  })
  async deleteModuleRelationship(
    @Args('input') input: DeleteModuleRelationshipInput,
  ): Promise<ModuleRelationshipResult> {
    return this.modulesService.deleteModuleRelationship(input);
  }

  /**
   * Creates a new module.
   * @param input - The data for creating the module
   * @returns Promise<Module> The newly created module
   */
  @Mutation(() => Module, {
    name: 'createModule',
    description: 'Creates a new module',
  })
  async createModule(@Args('input') input: CreateModuleInput): Promise<Module> {
    return this.modulesService.create(input);
  }
}
