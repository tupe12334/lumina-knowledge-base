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
import { ApiTags } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { CreateModuleInput } from './dto/create-module.input';
import { CreateManyModulesInput } from './dto/create-many-modules.input';
import { UpdateModuleInput } from './dto/update-module.input';
import { ModulesQueryDto } from './dto/modules-query.dto';
import { CreateModuleRelationshipInput } from './dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from './dto/delete-module-relationship.input';
import { ModulesApiDecorators } from './decorators/modules-api.decorators';

// Type declarations for query parameter conversions
type BooleanOrString = boolean | string;
interface FewQuestionsQuery { fewQuestions?: BooleanOrString }
interface HasQuestionsQuery { hasQuestions?: BooleanOrString }
interface HasPrerequisitesQuery { hasPrerequisites?: BooleanOrString }
interface HasPostrequisitesQuery { hasPostrequisites?: BooleanOrString }
interface HasSubModulesQuery { hasSubModules?: BooleanOrString }
interface HasParentModulesQuery { hasParentModules?: BooleanOrString }

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @ModulesApiDecorators.Create()
  create(@Body() createModuleDto: CreateModuleInput) {
    return this.modulesService.create(createModuleDto);
  }

  @Post('bulk')
  @ModulesApiDecorators.CreateMany()
  createMany(@Body() createManyModulesDto: CreateManyModulesInput) {
    return this.modulesService.createMany(createManyModulesDto);
  }

  @Get('questions-data')
  @ModulesApiDecorators.GetQuestionsData()
  async getModulesQuestionsData() {
    return this.modulesService.getModulesSummary();
  }

  @Get('by-questions')
  @ModulesApiDecorators.GetQuestionsData()
  async getModulesByQuestionCount(@Query('limit') limit?: number) {
    return this.modulesService.getModulesByQuestionCount(limit);
  }

  @Get()
  @ModulesApiDecorators.FindAll()
  findAll(@Query() query: ModulesQueryDto) {
    // Create a converted query object to handle string to boolean conversion
    const convertedQuery = { ...query };

    if (typeof query.fewQuestions === 'string') {
      const typedQuery = convertedQuery satisfies FewQuestionsQuery;
      typedQuery.fewQuestions = String(query.fewQuestions).toLowerCase() === 'true';
    }
    if (typeof query.hasQuestions === 'string') {
      const typedQuery = convertedQuery satisfies HasQuestionsQuery;
      typedQuery.hasQuestions = String(query.hasQuestions).toLowerCase() === 'true';
    }
    if (typeof query.hasPrerequisites === 'string') {
      const typedQuery = convertedQuery satisfies HasPrerequisitesQuery;
      typedQuery.hasPrerequisites = String(query.hasPrerequisites).toLowerCase() === 'true';
    }
    if (typeof query.hasPostrequisites === 'string') {
      const typedQuery = convertedQuery satisfies HasPostrequisitesQuery;
      typedQuery.hasPostrequisites = String(query.hasPostrequisites).toLowerCase() === 'true';
    }
    if (typeof query.hasSubModules === 'string') {
      const typedQuery = convertedQuery satisfies HasSubModulesQuery;
      typedQuery.hasSubModules = String(query.hasSubModules).toLowerCase() === 'true';
    }
    if (typeof query.hasParentModules === 'string') {
      const typedQuery = convertedQuery satisfies HasParentModulesQuery;
      typedQuery.hasParentModules = String(query.hasParentModules).toLowerCase() === 'true';
    }

    return this.modulesService.findAll(convertedQuery);
  }

  @Get(':id')
  @ModulesApiDecorators.FindOne()
  findOne(@Param('id') id: string) {
    return this.modulesService.findUnique(id);
  }

  @Put(':id')
  @ModulesApiDecorators.Update()
  update(
    @Param('id') id: string,
    @Body() updateModuleDto: Omit<UpdateModuleInput, 'id'>,
  ) {
    return this.modulesService.update(id, { ...updateModuleDto, id });
  }

  @Delete(':id')
  @ModulesApiDecorators.Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.modulesService.delete(id);
  }

  @Post('relationship')
  @ModulesApiDecorators.CreateRelationship()
  createRelationship(
    @Body() createModuleRelationshipDto: CreateModuleRelationshipInput,
  ) {
    return this.modulesService.createModuleRelationship(
      createModuleRelationshipDto,
    );
  }

  @Delete('relationship')
  @ModulesApiDecorators.DeleteRelationship()
  deleteRelationship(
    @Body() deleteModuleRelationshipDto: DeleteModuleRelationshipInput,
  ) {
    return this.modulesService.deleteModuleRelationship(
      deleteModuleRelationshipDto,
    );
  }

  @Get(':id/summary')
  @ModulesApiDecorators.GetSummary()
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async getSummary(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<string> {
    try {
      return await this.modulesService.generateSummary(id);
    } catch (err: unknown) {
      if (err instanceof NotFoundException) throw new NotFoundException(err.message);
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes('not found')) {
        throw new NotFoundException(message);
      }
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
}
