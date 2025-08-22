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
  Query,
} from '@nestjs/common';
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
import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';
import { CreateManyCoursesInput } from './dto/create-many-courses.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CreateCourseRelationshipInput } from './dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from './dto/delete-course-relationship.input';
import { SetCourseModulesInput } from './dto/set-course-modules.input';
import { DeleteCourseInput } from './dto/delete-course.input';
import { Course } from './models/Course.entity';
import { CourseRelationshipResult } from './dto/course-relationship-result.type';
import { CoursesQueryInput } from './dto/courses-query.input';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new course',
    description: 'Creates a new course record.',
  })
  @ApiCreatedResponse({
    type: Course,
    description: 'The newly created course.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createCourseDto: CreateCourseInput) {
    return this.coursesService.create(createCourseDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Create multiple courses',
    description: 'Creates multiple course records in a single operation.',
  })
  @ApiCreatedResponse({
    description: 'The number of courses created.',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of courses created',
          example: 5,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  createMany(@Body() createManyCoursesDto: CreateManyCoursesInput) {
    return this.coursesService.createMany(createManyCoursesDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all courses',
    description:
      'Returns a list of all courses. Optionally filter by university or degree.',
  })
  @ApiOkResponse({
    type: Course,
    isArray: true,
    description: 'A list of courses.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll(@Query() query: CoursesQueryInput) {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a course by ID',
    description: 'Returns a single course by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the course', type: String })
  @ApiOkResponse({
    type: Course,
    description: 'The course with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a course by ID',
    description: 'Updates an existing course record.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the course', type: String })
  @ApiOkResponse({ type: Course, description: 'The updated course.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: Omit<UpdateCourseInput, 'courseId'>,
  ) {
    return this.coursesService.updateCourse({
      ...updateCourseDto,
      courseId: id,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a course by ID',
    description: 'Deletes a course record by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the course', type: String })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Course successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    const deleteCourseInput: DeleteCourseInput = { courseId: id, force: true };
    return this.coursesService.deleteCourse(deleteCourseInput);
  }

  @Post('relationship')
  @ApiOperation({
    summary: 'Create a course relationship',
    description: 'Creates a new relationship between courses.',
  })
  @ApiCreatedResponse({
    type: CourseRelationshipResult,
    description: 'The newly created course relationship.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  createRelationship(
    @Body() createCourseRelationshipDto: CreateCourseRelationshipInput,
  ) {
    return this.coursesService.createCourseRelationship(
      createCourseRelationshipDto,
    );
  }

  @Delete('relationship')
  @ApiOperation({
    summary: 'Delete a course relationship',
    description: 'Deletes an existing relationship between courses.',
  })
  @ApiNoContentResponse({
    description: 'Course relationship successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Course relationship not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  deleteRelationship(
    @Body() deleteCourseRelationshipDto: DeleteCourseRelationshipInput,
  ) {
    return this.coursesService.deleteCourseRelationship(
      deleteCourseRelationshipDto,
    );
  }

  @Post(':id/modules')
  @ApiOperation({
    summary: 'Set modules for a course',
    description: 'Sets or updates the modules associated with a course.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the course', type: String })
  @ApiOkResponse({
    type: Course,
    description: 'The course with the updated modules.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Course or Module not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  setModules(
    @Param('id') id: string,
    @Body() setCourseModulesDto: Omit<SetCourseModulesInput, 'courseId'>,
  ) {
    return this.coursesService.setCourseModules({
      ...setCourseModulesDto,
      courseId: id,
    });
  }

  @Get(':id/summary')
  @ApiOperation({
    summary: 'Get course summary',
    description:
      'Returns a human-readable plain text summary for the specified course.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the course',
    type: String,
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    description: 'Plain text summary of the course',
    schema: { type: 'string' },
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async getSummary(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<string> {
    try {
      return await this.coursesService.generateSummary(id);
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
