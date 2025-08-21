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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FacultiesService } from './faculties.service';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { CreateManyFacultiesInput } from './dto/create-many-faculties.input';
import { UpdateFacultyInput } from './dto/update-faculty.input';
import { Faculty } from './models/Faculty.entity';

@ApiTags('faculties')
@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new faculty',
    description: 'Creates a new faculty record.',
  })
  @ApiCreatedResponse({ type: Faculty, description: 'Faculty created' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createFacultyDto: CreateFacultyInput) {
    return this.facultiesService.create(createFacultyDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Create multiple faculties',
    description: 'Creates multiple faculty records in a single operation.',
  })
  @ApiCreatedResponse({
    description: 'The number of faculties created.',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of faculties created',
          example: 5,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  createMany(@Body() createManyFacultiesDto: CreateManyFacultiesInput) {
    return this.facultiesService.createMany(createManyFacultiesDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all faculties',
    description: 'Returns a list of all faculties.',
  })
  @ApiOkResponse({
    type: Faculty,
    isArray: true,
    description: 'A list of faculties.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll() {
    return this.facultiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a faculty by ID',
    description: 'Returns a single faculty by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the faculty', type: String })
  @ApiOkResponse({
    type: Faculty,
    description: 'The faculty with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'Faculty not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.facultiesService.getFacultyById(id);
  }

  @Get('university/:universityId')
  @ApiOperation({
    summary: 'Retrieve faculties by university ID',
    description:
      'Returns a list of faculties associated with a specific university ID.',
  })
  @ApiParam({
    name: 'universityId',
    description: 'The ID of the university',
    type: String,
  })
  @ApiOkResponse({
    type: Faculty,
    isArray: true,
    description: 'A list of faculties for the specified university.',
  })
  @ApiResponse({ status: 404, description: 'University not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findByUniversity(@Param('universityId') universityId: string) {
    return this.facultiesService.getFacultiesByUniversity(universityId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a faculty by ID',
    description: 'Updates an existing faculty record.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the faculty', type: String })
  @ApiOkResponse({ type: Faculty, description: 'The updated faculty.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Faculty not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id') id: string,
    @Body() updateFacultyDto: Omit<UpdateFacultyInput, 'id'>,
  ) {
    return this.facultiesService.update(id, { ...updateFacultyDto, id });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a faculty by ID',
    description: 'Deletes a faculty record by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the faculty', type: String })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Faculty deleted' })
  @ApiResponse({ status: 404, description: 'Faculty not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.facultiesService.delete(id);
  }
}
