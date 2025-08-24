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
  ParseUUIDPipe,
  NotFoundException,
  Header,
} from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { CreateManyInstitutionsInput } from './dto/create-many-institutions.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';
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
import { Institution } from './models/Institution.entity';

@ApiTags('universities')
@Controller('universities')
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new institution',
    description: 'Creates a new institution record.',
  })
  @ApiCreatedResponse({
    type: Institution,
    description: 'The newly created institution.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createUniversityDto: CreateInstitutionInput) {
    return this.institutionsService.create(createUniversityDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Create multiple institutions',
    description: 'Creates multiple institution records in a single operation.',
  })
  @ApiCreatedResponse({
    description: 'The number of institutions created.',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of institutions created',
          example: 5,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  createMany(@Body() createManyUniversitiesDto: CreateManyInstitutionsInput) {
    return this.institutionsService.createMany(createManyUniversitiesDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all institutions',
    description: 'Returns a list of all institutions.',
  })
  @ApiOkResponse({
    type: Institution,
    isArray: true,
    description: 'A list of institutions.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll() {
    return this.institutionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve an institution by ID',
    description: 'Returns a single institution by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the institution',
    type: String,
  })
  @ApiOkResponse({
    type: Institution,
    description: 'The institution with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.institutionsService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an institution by ID',
    description: 'Updates an existing institution record.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the institution',
    type: String,
  })
  @ApiOkResponse({ type: Institution, description: 'The updated institution.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id') id: string,
    @Body() updateUniversityDto: Omit<UpdateInstitutionInput, 'id'>,
  ) {
    return this.institutionsService.update(id, { ...updateUniversityDto, id });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an institution by ID',
    description: 'Deletes an institution record by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the institution',
    type: String,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Institution successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Institution not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.institutionsService.remove(id);
  }

  @Get(':id/summary')
  @ApiOperation({
    summary: 'Get institution summary',
    description:
      'Returns a human-readable plain text summary for the specified institution.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the institution',
    type: String,
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    description: 'Plain text summary of the institution',
    schema: { type: 'string' },
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'University not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async getSummary(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<string> {
    try {
      return await this.institutionsService.generateSummary(id);
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
