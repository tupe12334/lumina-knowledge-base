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
    summary: 'Create a new university',
    description: 'Creates a new university record.',
  })
  @ApiCreatedResponse({
    type: Institution,
    description: 'The newly created university.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createUniversityDto: CreateInstitutionInput) {
    return this.institutionsService.create(createUniversityDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Create multiple universities',
    description: 'Creates multiple university records in a single operation.',
  })
  @ApiCreatedResponse({
    description: 'The number of universities created.',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of universities created',
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
    summary: 'Retrieve all universities',
    description: 'Returns a list of all universities.',
  })
  @ApiOkResponse({
    type: Institution,
    isArray: true,
    description: 'A list of universities.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll() {
    return this.institutionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a university by ID',
    description: 'Returns a single university by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the university',
    type: String,
  })
  @ApiOkResponse({
    type: Institution,
    description: 'The university with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'University not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.institutionsService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a university by ID',
    description: 'Updates an existing university record.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the university',
    type: String,
  })
  @ApiOkResponse({ type: Institution, description: 'The updated university.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'University not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id') id: string,
    @Body() updateUniversityDto: Omit<UpdateInstitutionInput, 'id'>,
  ) {
    return this.institutionsService.update(id, { ...updateUniversityDto, id });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a university by ID',
    description: 'Deletes a university record by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the university',
    type: String,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'University successfully deleted.' })
  @ApiResponse({ status: 404, description: 'University not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.institutionsService.remove(id);
  }

  @Get(':id/summary')
  @ApiOperation({
    summary: 'Get university summary',
    description:
      'Returns a human-readable plain text summary for the specified university.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the university',
    type: String,
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    description: 'Plain text summary of the university',
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
