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
import { ModulesService } from './modules.service';
import { CreateModuleInput } from './dto/create-module.input';
import { UpdateModuleInput } from './dto/update-module.input';
import { ModulesQueryInput } from './dto/modules-query.input';
import { CreateModuleRelationshipInput } from './dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from './dto/delete-module-relationship.input';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(@Body() createModuleDto: CreateModuleInput) {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
  findAll(@Query() query: ModulesQueryInput) {
    return this.modulesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findUnique(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateModuleDto: Omit<UpdateModuleInput, 'id'>,
  ) {
    return this.modulesService.update(id, { ...updateModuleDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.modulesService.delete(id);
  }

  @Post('relationship')
  createRelationship(
    @Body() createModuleRelationshipDto: CreateModuleRelationshipInput,
  ) {
    return this.modulesService.createModuleRelationship(
      createModuleRelationshipDto,
    );
  }

  @Delete('relationship')
  deleteRelationship(
    @Body() deleteModuleRelationshipDto: DeleteModuleRelationshipInput,
  ) {
    return this.modulesService.deleteModuleRelationship(
      deleteModuleRelationshipDto,
    );
  }
}
