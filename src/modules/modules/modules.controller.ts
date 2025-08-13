import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { Module as ModuleEntity } from './models/Module.entity';
import { ModulesQueryDto } from './dto/modules-query.dto';

@ApiTags('modules')
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
  @ApiQuery({
    name: 'minQuestions',
    required: false,
    description: 'Filter modules by minimum number of questions',
    type: 'integer',
    example: 5,
  })
  @ApiQuery({
    name: 'maxQuestions',
    required: false,
    description: 'Filter modules by maximum number of questions',
    type: 'integer',
    example: 20,
  })
  @ApiQuery({
    name: 'exactQuestions',
    required: false,
    description: 'Filter modules by exact number of questions',
    type: 'integer',
    example: 10,
  })
  async getModules(@Query() query: ModulesQueryDto): Promise<ModuleEntity[]> {
    return this.modulesService.findAll(query);
  }
}
