import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { Module as ModuleEntity } from './models/Module.entity';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get(':id')
  @ApiOkResponse({ type: ModuleEntity })
  async getModule(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ModuleEntity | null> {
    return this.modulesService.findUnique(id);
  }

  @Get()
  @ApiOkResponse({ type: [ModuleEntity] })
  async getModules(): Promise<ModuleEntity[]> {
    return this.modulesService.findAll();
  }
}
