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
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DegreesService } from './degrees.service';
import { CreateDegreeInput } from './dto/create-degree.input';
import { UpdateDegreeInput } from './dto/update-degree.input';
import { SetDegreeFacultyInput } from './dto/set-degree-faculty.input';
import { AddCourseToDegreeInput } from './dto/add-course-to-degree.input';
import { DegreesQueryDto } from './dto/degrees-query.dto';
import { Degree } from './models/Degree.entity';

@ApiTags('degrees')
@Controller('degrees')
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new degree', description: 'Creates a new degree record.' })
  @ApiCreatedResponse({ type: Degree, description: 'The newly created degree.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createDegreeDto: CreateDegreeInput) {
    return this.degreesService.create(createDegreeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all degrees', description: 'Returns a list of all degrees.' })
  @ApiOkResponse({ type: Degree, isArray: true, description: 'A list of degrees.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll(@Query() query: DegreesQueryDto) {
    return this.degreesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a degree by ID', description: 'Returns a single degree by its ID.' })
  @ApiOkResponse({ type: Degree, description: 'The degree with the specified ID.' })
  @ApiResponse({ status: 404, description: 'Degree not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.degreesService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a degree by ID', description: 'Updates an existing degree record.' })
  @ApiOkResponse({ type: Degree, description: 'The updated degree.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Degree not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id') id: string,
    @Body() updateDegreeDto: Omit<UpdateDegreeInput, 'id'>,
  ) {
    return this.degreesService.update(id, { ...updateDegreeDto, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a degree by ID', description: 'Deletes a degree record by its ID.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Degree successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Degree not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.degreesService.delete(id);
  }

  @Post(':id/faculty')
  @ApiOperation({ summary: 'Set faculty for a degree', description: 'Sets or updates the faculty associated with a degree.' })
  @ApiOkResponse({ type: Degree, description: 'The degree with the updated faculty.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Degree or Faculty not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  setFaculty(
    @Param('id') id: string,
    @Body() setDegreeFacultyDto: Omit<SetDegreeFacultyInput, 'degreeId'>,
  ) {
    return this.degreesService.setFacultyForDegree(
      id,
      setDegreeFacultyDto.facultyId ?? null,
    );
  }

  @Post(':id/courses')
  @ApiOperation({ summary: 'Add a course to a degree', description: 'Adds a course to the specified degree.' })
  @ApiOkResponse({ type: Degree, description: 'The degree with the added course.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Degree or Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  addCourse(
    @Param('id') id: string,
    @Body() addCourseToDegreeDto: Omit<AddCourseToDegreeInput, 'degreeId'>,
  ) {
    return this.degreesService.addCourse(id, addCourseToDegreeDto.courseId);
  }
}
