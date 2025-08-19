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
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { CreateModuleInput } from './dto/create-module.input';
import { UpdateModuleInput } from './dto/update-module.input';
import { ModulesQueryInput } from './dto/modules-query.input';
import { CreateModuleRelationshipInput } from './dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from './dto/delete-module-relationship.input';
import { Module } from './models/Module.entity';
import { ModuleRelationshipResult } from './dto/module-relationship-result.dto';

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module', description: 'Creates a new module record.' })
  @ApiCreatedResponse({ type: Module, description: 'The newly created module.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createModuleDto: CreateModuleInput) {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all modules', description: 'Returns a list of all modules.' })
  @ApiOkResponse({ type: Module, isArray: true, description: 'A list of modules.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll(@Query() query: ModulesQueryInput) {
    return this.modulesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a module by ID', description: 'Returns a single module by its ID.' })
  @ApiOkResponse({ type: Module, description: 'The module with the specified ID.' })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.modulesService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a module by ID', description: 'Updates an existing module record.' })
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
  @ApiOperation({ summary: 'Delete a module by ID', description: 'Deletes a module record by its ID.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Module successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.modulesService.delete(id);
  }

  @Post('relationship')
  @ApiOperation({ summary: 'Create a module relationship', description: 'Creates a new relationship between modules.' })
  @ApiCreatedResponse({ type: ModuleRelationshipResult, description: 'The newly created module relationship.' })
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
  @ApiOperation({ summary: 'Delete a module relationship', description: 'Deletes an existing relationship between modules.' })
  @ApiNoContentResponse({ description: 'Module relationship successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Module relationship not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  deleteRelationship(
    @Body() deleteModuleRelationshipDto: DeleteModuleRelationshipInput,
  ) {
    return this.modulesService.deleteModuleRelationship(
      deleteModuleRelationshipDto,
    );
  }
}
