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
import { UniversitiesService } from './universities.service';
import { CreateUniversityInput } from './dto/create-university.input';
import { UpdateUniversityInput } from './dto/update-university.input';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { University } from './models/University.entity';

@ApiTags('universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new university',
    description: 'Creates a new university record.',
  })
  @ApiCreatedResponse({
    type: University,
    description: 'The newly created university.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createUniversityDto: CreateUniversityInput) {
    return this.universitiesService.create(createUniversityDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all universities',
    description: 'Returns a list of all universities.',
  })
  @ApiOkResponse({
    type: University,
    isArray: true,
    description: 'A list of universities.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll() {
    return this.universitiesService.findAll();
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
    type: University,
    description: 'The university with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'University not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.universitiesService.findUnique(id);
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
  @ApiOkResponse({ type: University, description: 'The updated university.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'University not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id') id: string,
    @Body() updateUniversityDto: Omit<UpdateUniversityInput, 'id'>,
  ) {
    return this.universitiesService.update(id, { ...updateUniversityDto, id });
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
    return this.universitiesService.remove(id);
  }
}
