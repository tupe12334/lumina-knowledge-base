import {
  Controller,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CoursesService } from '../courses.service';
import { CreateCourseRelationshipInput } from '../dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from '../dto/delete-course-relationship.input';
import { CourseRelationshipResult } from '../dto/course-relationship-result.type';

@ApiTags('courses')
@Controller('courses/relationship')
export class CoursesRelationshipController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
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

  @Delete()
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
}