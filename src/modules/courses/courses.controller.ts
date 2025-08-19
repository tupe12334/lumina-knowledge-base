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
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { CreateCourseRelationshipInput } from './dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from './dto/delete-course-relationship.input';
import { SetCourseModulesInput } from './dto/set-course-modules.input';
import { DeleteCourseInput } from './dto/delete-course.input';
import { Course } from './models/Course.entity';
import { CourseRelationshipResult } from './dto/course-relationship-result.type';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiCreatedResponse({ type: Course })
  create(@Body() createCourseDto: CreateCourseInput) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOkResponse({ type: Course, isArray: true })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Course })
  findOne(@Param('id') id: string) {
    return this.coursesService.findUnique(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: Course })
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
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    const deleteCourseInput: DeleteCourseInput = { courseId: id, force: true };
    return this.coursesService.deleteCourse(deleteCourseInput);
  }

  @Post('relationship')
  @ApiCreatedResponse({ type: CourseRelationshipResult })
  createRelationship(
    @Body() createCourseRelationshipDto: CreateCourseRelationshipInput,
  ) {
    return this.coursesService.createCourseRelationship(
      createCourseRelationshipDto,
    );
  }

  @Delete('relationship')
  @ApiNoContentResponse()
  deleteRelationship(
    @Body() deleteCourseRelationshipDto: DeleteCourseRelationshipInput,
  ) {
    return this.coursesService.deleteCourseRelationship(
      deleteCourseRelationshipDto,
    );
  }

  @Post(':id/modules')
  @ApiOkResponse({ type: Course })
  setModules(
    @Param('id') id: string,
    @Body() setCourseModulesDto: Omit<SetCourseModulesInput, 'courseId'>,
  ) {
    return this.coursesService.setCourseModules({
      ...setCourseModulesDto,
      courseId: id,
    });
  }
}
