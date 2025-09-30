import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, Query, ParseUUIDPipe, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DegreesService } from './degrees.service';
import { CreateDegreeInput } from './dto/create-degree.input';
import { CreateManyDegreesInput } from './dto/create-many-degrees.input';
import { UpdateDegreeInput } from './dto/update-degree.input';
import { SetDegreeFacultyInput } from './dto/set-degree-faculty.input';
import { DegreesQueryDto } from './dto/degrees-query.dto';
import { AddCourseDto } from './dto/add-course.dto';
import { DegreesApiDecorators } from './decorators/degrees-api.decorators';
import { ErrorHandlerHelper } from './helpers/error-handler.helper';

@ApiTags('degrees')
@Controller('degrees')
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @Post()
  @DegreesApiDecorators.CreateDegree()
  create(@Body() createDegreeDto: CreateDegreeInput) {
    return this.degreesService.create(createDegreeDto);
  }
  @Post('bulk')
  @DegreesApiDecorators.CreateMany()
  createMany(@Body() createManyDegreesDto: CreateManyDegreesInput) {
    return this.degreesService.createMany(createManyDegreesDto);
  }
  @Get()
  @DegreesApiDecorators.FindAll()
  findAll(@Query() query: DegreesQueryDto) {
    return this.degreesService.findAll(query);
  }
  @Get(':id')
  @DegreesApiDecorators.FindOne()
  findOne(@Param('id') id: string) {
    return this.degreesService.findUnique(id);
  }
  @Put(':id')
  @DegreesApiDecorators.Update()
  update(
    @Param('id') id: string,
    @Body() updateDegreeDto: Omit<UpdateDegreeInput, 'id'>,
  ) {
    return this.degreesService.update(id, { ...updateDegreeDto, id });
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DegreesApiDecorators.Delete()
  remove(@Param('id') id: string) {
    return this.degreesService.delete(id);
  }
  @Post(':id/faculty')
  @DegreesApiDecorators.SetFaculty()
  setFaculty(
    @Param('id') id: string,
    @Body() setDegreeFacultyDto: Omit<SetDegreeFacultyInput, 'degreeId'>,
  ) {
    return this.degreesService.setFacultyForDegree(id, ErrorHandlerHelper.normalizeFacultyId(setDegreeFacultyDto.facultyId));
  }
  @Post(':id/courses')
  @DegreesApiDecorators.AddCourse()
  addCourse(
    @Param('id') id: string,
    @Body() addCourseDto: AddCourseDto,
  ) {
    return this.degreesService.addCourse(id, addCourseDto.courseId);
  }
  @Get(':id/courses')
  @DegreesApiDecorators.GetCourses()
  async getCourses(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.degreesService.getCoursesByDegreeId(id);
  }
  @Delete(':id/courses/:courseId')
  @DegreesApiDecorators.RemoveCourse()
  removeCourse(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('courseId', new ParseUUIDPipe({ version: '4' })) courseId: string,
  ) {
    return this.degreesService.removeCourse(id, courseId);
  }
  @Get(':id/summary')
  @DegreesApiDecorators.GetSummary()
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async getSummary(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<string> {
    try {
      return await this.degreesService.generateSummary(id);
    } catch (err: unknown) {
      ErrorHandlerHelper.handleSummaryError(err);
    }
  }
}
