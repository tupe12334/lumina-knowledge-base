import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  Body,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { Course } from './models/Course.entity';
import { DeleteCourseInput } from './dto/delete-course.input';
import { DeleteCourseResult } from './dto/delete-course-result.type';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOkResponse({ type: [Course] })
  async getCourses(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Course })
  async getCourse(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Course | null> {
    return this.coursesService.findUnique(id);
  }
}
