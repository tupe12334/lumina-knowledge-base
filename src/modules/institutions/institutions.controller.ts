import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, ParseUUIDPipe, NotFoundException, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiResponse, ApiProduces, ApiNoContentResponse } from '@nestjs/swagger';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { CreateManyInstitutionsInput } from './dto/create-many-institutions.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';
import { InstitutionsApiDecorators } from './decorators/institutions-api.decorators';

@ApiTags('universities')
@Controller('universities')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Post()
  @InstitutionsApiDecorators.Create()
  create(@Body() createUniversityDto: CreateInstitutionInput) {
    return this.institutionsService.create(createUniversityDto);
  }

  @Post('bulk')
  @InstitutionsApiDecorators.CreateMany()
  createMany(@Body() createManyUniversitiesDto: CreateManyInstitutionsInput) {
    return this.institutionsService.createMany(createManyUniversitiesDto);
  }

  @Get()
  @InstitutionsApiDecorators.FindAll()
  findAll() {
    return this.institutionsService.findAll();
  }

  @Get(':id')
  @InstitutionsApiDecorators.FindOne()
  findOne(@Param('id') id: string) {
    return this.institutionsService.findUnique(id);
  }

  @Put(':id')
  @InstitutionsApiDecorators.Update()
  update(
    @Param('id') id: string,
    @Body() updateUniversityDto: Omit<UpdateInstitutionInput, 'id'>,
  ) {
    return this.institutionsService.update(id, { ...updateUniversityDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @InstitutionsApiDecorators.Delete()
  remove(@Param('id') id: string) {
    return this.institutionsService.remove(id);
  }

  @Get(':id/summary')
  @InstitutionsApiDecorators.GetSummary()
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async getSummary(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<string> {
    try {
      return await this.institutionsService.generateSummary(id);
    } catch (err: unknown) {
      if (err instanceof NotFoundException && err instanceof Error) {
        throw new NotFoundException(err.message);
      }
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes('not found')) {
        throw new NotFoundException(message);
      }
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
}
