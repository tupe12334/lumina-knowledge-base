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
import { DegreesService } from './degrees.service';
import { CreateDegreeInput } from './dto/create-degree.input';
import { UpdateDegreeInput } from './dto/update-degree.input';
import { SetDegreeFacultyInput } from './dto/set-degree-faculty.input';
import { AddCourseToDegreeInput } from './dto/add-course-to-degree.input';
import { DegreesQueryDto } from './dto/degrees-query.dto';

@ApiTags('degrees')
@Controller('degrees')
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @Post()
  create(@Body() createDegreeDto: CreateDegreeInput) {
    return this.degreesService.create(createDegreeDto);
  }

  @Get()
  findAll(@Query() query: DegreesQueryDto) {
    return this.degreesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.degreesService.findUnique(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDegreeDto: Omit<UpdateDegreeInput, 'id'>,
  ) {
    return this.degreesService.update(id, { ...updateDegreeDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.degreesService.delete(id);
  }

  @Post(':id/faculty')
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
  addCourse(
    @Param('id') id: string,
    @Body() addCourseToDegreeDto: Omit<AddCourseToDegreeInput, 'degreeId'>,
  ) {
    return this.degreesService.addCourse(id, addCourseToDegreeDto.courseId);
  }
}
