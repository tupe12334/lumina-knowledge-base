import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { Course } from './models/Course.entity';

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
