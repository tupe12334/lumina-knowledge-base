import {
  Resolver,
  Query,
  Args,
  ID,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ModulesService } from './modules.service';
import { Module } from './models/Module.entity';
import { ModulesQueryInput } from './dto/modules-query.input';
import { CreateModuleRelationshipInput } from './dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from './dto/delete-module-relationship.input';
import { ModuleRelationshipResult } from './dto/module-relationship-result.type';
import { CreateModuleInput } from './dto/create-module.input';
import { CreateManyModulesInput } from './dto/create-many-modules.input';
import { UpdateModuleInput } from './dto/update-module.input';
import { CreateManyResult } from '../common/create-many-result.type';
import { QuestionsService } from '../questions/questions.service';
import { Question } from '../questions/models/Question.entity';
import { QuestionsQueryDto } from '../questions/dto/question-query.dto';

/**
 * GraphQL resolver for module-related operations.
 * Provides GraphQL queries for retrieving module information.
 */
@Resolver(() => Module)
export class ModulesResolver {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly questionsService: QuestionsService,
  ) {}

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

  /**
   * Creates multiple modules in bulk.
   * @param input - The data for creating the modules
   * @returns Promise<CreateManyResult> The result containing count of created modules
   */
  @Mutation(() => CreateManyResult, {
    name: 'createManyModules',
    description: 'Creates multiple modules in bulk',
  })
  async createManyModules(
    @Args('input') input: CreateManyModulesInput,
  ): Promise<CreateManyResult> {
    return this.modulesService.createMany(input);
  }

  @Mutation(() => Module)
  updateModule(
    @Args('updateModuleInput') updateModuleInput: UpdateModuleInput,
  ) {
    return this.modulesService.update(updateModuleInput.id, updateModuleInput);
  }

  @Mutation(() => Module)
  removeModule(@Args('id', { type: () => ID }) id: string) {
    return this.modulesService.delete(id);
  }

  /**
   * ResolveField to fetch questions for a specific module with optional filtering.
   * This does not add a new endpoint; it augments the Module type with a questions field.
   */
  @ResolveField(() => [Question], {
    name: 'questions',
    description:
      'Questions associated with this module (supports same filters as questions query)',
  })
  async questions(
    @Parent() module: Module,
    @Args('input', { type: () => QuestionsQueryDto, nullable: true })
    input?: QuestionsQueryDto,
  ): Promise<Question[]> {
    // Discard any external moduleIds to enforce this field is scoped to the current module
    const rest = ((args: QuestionsQueryDto | undefined): QuestionsQueryDto => {
      if (!args) return {} as QuestionsQueryDto;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { moduleIds, ...other } = args as QuestionsQueryDto & {
        moduleIds?: string[];
      };
      return other as QuestionsQueryDto;
    })(input);
    const effectiveInput: QuestionsQueryDto = {
      ...rest,
      moduleId: module.id,
    };
    return this.questionsService.findAll(effectiveInput);
  }
}
