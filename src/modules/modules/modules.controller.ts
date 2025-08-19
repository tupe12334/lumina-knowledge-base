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
  @ApiCreatedResponse({ type: Module })
  create(@Body() createModuleDto: CreateModuleInput) {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
  @ApiOkResponse({ type: Module, isArray: true })
  findAll(@Query() query: ModulesQueryInput) {
    return this.modulesService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Module })
  findOne(@Param('id') id: string) {
    return this.modulesService.findUnique(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: Module })
  update(
    @Param('id') id: string,
    @Body() updateModuleDto: Omit<UpdateModuleInput, 'id'>,
  ) {
    return this.modulesService.update(id, { ...updateModuleDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.modulesService.delete(id);
  }

  @Post('relationship')
  @ApiCreatedResponse({ type: ModuleRelationshipResult })
  createRelationship(
    @Body() createModuleRelationshipDto: CreateModuleRelationshipInput,
  ) {
    return this.modulesService.createModuleRelationship(
      createModuleRelationshipDto,
    );
  }

  @Delete('relationship')
  @ApiNoContentResponse()
  deleteRelationship(
    @Body() deleteModuleRelationshipDto: DeleteModuleRelationshipInput,
  ) {
    return this.modulesService.deleteModuleRelationship(
      deleteModuleRelationshipDto,
    );
  }
}
