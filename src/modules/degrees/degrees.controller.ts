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
  @ApiCreatedResponse({ type: Degree })
  create(@Body() createDegreeDto: CreateDegreeInput) {
    return this.degreesService.create(createDegreeDto);
  }

  @Get()
  @ApiOkResponse({ type: Degree, isArray: true })
  findAll(@Query() query: DegreesQueryDto) {
    return this.degreesService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Degree })
  findOne(@Param('id') id: string) {
    return this.degreesService.findUnique(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: Degree })
  update(
    @Param('id') id: string,
    @Body() updateDegreeDto: Omit<UpdateDegreeInput, 'id'>,
  ) {
    return this.degreesService.update(id, { ...updateDegreeDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.degreesService.delete(id);
  }

  @Post(':id/faculty')
  @ApiOkResponse({ type: Degree })
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
  @ApiOkResponse({ type: Degree })
  addCourse(
    @Param('id') id: string,
    @Body() addCourseToDegreeDto: Omit<AddCourseToDegreeInput, 'degreeId'>,
  ) {
    return this.degreesService.addCourse(id, addCourseToDegreeDto.courseId);
  }
}
