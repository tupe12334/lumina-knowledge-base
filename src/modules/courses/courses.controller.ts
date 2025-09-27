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
import { ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';
import { CreateManyCoursesInput } from './dto/create-many-courses.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { DeleteCourseInput } from './dto/delete-course.input';
import { CoursesQueryInput } from './dto/courses-query.input';
import { CoursesApiDecorators } from './decorators/courses-api.decorators';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @CoursesApiDecorators.CreateCourse()
  create(@Body() createCourseDto: CreateCourseInput) {
    return this.coursesService.create(createCourseDto);
  }

  @Post('bulk')
  @CoursesApiDecorators.CreateMany()
  createMany(@Body() createManyCoursesDto: CreateManyCoursesInput) {
    return this.coursesService.createMany(createManyCoursesDto);
  }

  @Get()
  @CoursesApiDecorators.FindAll()
  findAll(@Query() query: CoursesQueryInput) {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @CoursesApiDecorators.FindOne()
  findOne(@Param('id') id: string) {
    return this.coursesService.findUnique(id);
  }

  @Put(':id')
  @CoursesApiDecorators.Update()
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @CoursesApiDecorators.Delete()
  remove(@Param('id') id: string) {
    const deleteCourseInput: DeleteCourseInput = { courseId: id, force: true };
    return this.coursesService.deleteCourse(deleteCourseInput);
  }

}
