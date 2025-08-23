import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  Query,
  ParseUUIDPipe,
  NotFoundException,
  Header,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { CreateModuleInput } from './dto/create-module.input';
import { CreateManyModulesInput } from './dto/create-many-modules.input';
import { UpdateModuleInput } from './dto/update-module.input';
import { ModulesQueryDto } from './dto/modules-query.dto';
import { CreateModuleRelationshipInput } from './dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from './dto/delete-module-relationship.input';
import { Module } from './models/Module.entity';
import { ModuleRelationshipResult } from './dto/module-relationship-result.dto';

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new module',
    description: 'Creates a new module record.',
  })
  @ApiCreatedResponse({
    type: Module,
    description: 'The newly created module.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createModuleDto: CreateModuleInput) {
    return this.modulesService.create(createModuleDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Create multiple modules',
    description: 'Creates multiple module records in a single operation.',
  })
  @ApiCreatedResponse({
    description: 'The number of modules created.',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of modules created',
          example: 5,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  createMany(@Body() createManyModulesDto: CreateManyModulesInput) {
    return this.modulesService.createMany(createManyModulesDto);
  }

  @Get('questions-data')
  @ApiOperation({
    summary: 'Get modules questions data',
    description:
      'Returns all modules with id, en_name, and questions_amount, sorted by question count (least questions first).',
  })
  @ApiOkResponse({
    description: 'A list of modules with their question counts.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          en_name: { type: 'string' },
          questions_amount: { type: 'number' },
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getModulesQuestionsData() {
    return this.modulesService.getModulesSummary();
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all modules',
    description: 'Returns a list of all modules.',
  })
  @ApiOkResponse({
    type: Module,
    isArray: true,
    description: 'A list of modules.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll(@Query() query: ModulesQueryDto) {
    // Create a converted query object to handle string to boolean conversion
    const convertedQuery = { ...query };

    if (typeof query.fewQuestions === 'string') {
      (convertedQuery as any).fewQuestions =
        (query.fewQuestions as string).toLowerCase() === 'true';
    }
    if (typeof query.hasQuestions === 'string') {
      (convertedQuery as any).hasQuestions =
        (query.hasQuestions as string).toLowerCase() === 'true';
    }
    if (typeof query.hasPrerequisites === 'string') {
      (convertedQuery as any).hasPrerequisites =
        (query.hasPrerequisites as string).toLowerCase() === 'true';
    }
    if (typeof query.hasPostrequisites === 'string') {
      (convertedQuery as any).hasPostrequisites =
        (query.hasPostrequisites as string).toLowerCase() === 'true';
    }
    if (typeof query.hasSubModules === 'string') {
      (convertedQuery as any).hasSubModules =
        (query.hasSubModules as string).toLowerCase() === 'true';
    }
    if (typeof query.hasParentModules === 'string') {
      (convertedQuery as any).hasParentModules =
        (query.hasParentModules as string).toLowerCase() === 'true';
    }

    return this.modulesService.findAll(convertedQuery);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a module by ID',
    description: 'Returns a single module by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the module', type: String })
  @ApiOkResponse({
    type: Module,
    description: 'The module with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.modulesService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a module by ID',
    description: 'Updates an existing module record.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the module', type: String })
  @ApiOkResponse({ type: Module, description: 'The updated module.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id') id: string,
    @Body() updateModuleDto: Omit<UpdateModuleInput, 'id'>,
  ) {
    return this.modulesService.update(id, { ...updateModuleDto, id });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a module by ID',
    description: 'Deletes a module record by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the module', type: String })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Module successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.modulesService.delete(id);
  }

  @Post('relationship')
  @ApiOperation({
    summary: 'Create a module relationship',
    description: 'Creates a new relationship between modules.',
  })
  @ApiCreatedResponse({
    type: ModuleRelationshipResult,
    description: 'The newly created module relationship.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  createRelationship(
    @Body() createModuleRelationshipDto: CreateModuleRelationshipInput,
  ) {
    return this.modulesService.createModuleRelationship(
      createModuleRelationshipDto,
    );
  }

  @Delete('relationship')
  @ApiOperation({
    summary: 'Delete a module relationship',
    description: 'Deletes an existing relationship between modules.',
  })
  @ApiNoContentResponse({
    description: 'Module relationship successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Module relationship not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  deleteRelationship(
    @Body() deleteModuleRelationshipDto: DeleteModuleRelationshipInput,
  ) {
    return this.modulesService.deleteModuleRelationship(
      deleteModuleRelationshipDto,
    );
  }

  @Get(':id/summary')
  @ApiOperation({
    summary: 'Get module summary',
    description:
      'Returns a human-readable plain text summary for the specified module.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the module',
    type: String,
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    description: 'Plain text summary of the module',
    schema: { type: 'string' },
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async getSummary(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<string> {
    try {
      return await this.modulesService.generateSummary(id);
    } catch (err: unknown) {
      if (err instanceof NotFoundException) throw err;
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes('not found')) {
        throw new NotFoundException(message);
      }
      throw err;
    }
  }
}
