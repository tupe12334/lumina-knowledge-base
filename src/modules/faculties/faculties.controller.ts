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
import { FacultiesService } from './faculties.service';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { UpdateFacultyInput } from './dto/update-faculty.input';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Post()
  create(@Body() createFacultyDto: CreateFacultyInput) {
    return this.facultiesService.create(createFacultyDto);
  }

  @Get()
  findAll() {
    return this.facultiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facultiesService.getFacultyById(id);
  }

  @Get('university/:universityId')
  findByUniversity(@Param('universityId') universityId: string) {
    return this.facultiesService.getFacultiesByUniversity(universityId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFacultyDto: Omit<UpdateFacultyInput, 'id'>,
  ) {
    return this.facultiesService.update(id, { ...updateFacultyDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.facultiesService.delete(id);
  }
}
