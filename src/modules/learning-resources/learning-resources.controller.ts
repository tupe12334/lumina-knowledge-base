import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LearningResourcesService } from './learning-resources.service';
import { LearningResource } from './models/LearningResource.entity';

@ApiTags('learning-resources')
@Controller('learning-resources')
export class LearningResourcesController {
  constructor(
    private readonly learningResourcesService: LearningResourcesService,
  ) {}

  @Get()
  @ApiOkResponse({ type: [LearningResource] })
  async getLearningResources(): Promise<LearningResource[]> {
    return this.learningResourcesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: LearningResource })
  async getLearningResource(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<LearningResource | null> {
    return this.learningResourcesService.findUnique(id);
  }

  @Get('module/:moduleId')
  @ApiOkResponse({ type: [LearningResource] })
  async getLearningResourcesByModule(
    @Param('moduleId', new ParseUUIDPipe()) moduleId: string,
  ): Promise<LearningResource[]> {
    return this.learningResourcesService.findByModuleId(moduleId);
  }
}
