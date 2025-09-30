import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FacultiesService } from './faculties.service';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { CreateManyFacultiesInput } from './dto/create-many-faculties.input';
import { UpdateFacultyInput } from './dto/update-faculty.input';
import { Faculty } from './models/Faculty.entity';
import { FacultiesApiDecorators } from './decorators/faculties-api.decorators';

@ApiTags('faculties')
@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Post()
  @FacultiesApiDecorators.Create()
  create(@Body() createFacultyDto: CreateFacultyInput) {
    return this.facultiesService.create(createFacultyDto);
  }

  @Post('bulk')
  @FacultiesApiDecorators.CreateMany()
  createMany(@Body() createManyFacultiesDto: CreateManyFacultiesInput) {
    return this.facultiesService.createMany(createManyFacultiesDto);
  }

  @Get()
  @FacultiesApiDecorators.FindAll()
  findAll() {
    return this.facultiesService.findAll();
  }

  @Get(':id')
  @FacultiesApiDecorators.FindOne()
  findOne(@Param('id') id: string) {
    return this.facultiesService.getFacultyById(id);
  }

  @Get('university/:universityId')
  @FacultiesApiDecorators.FindByUniversity()
  findByUniversity(@Param('universityId') universityId: string) {
    return this.facultiesService.getFacultiesByInstitution(universityId);
  }

  @Put(':id')
  @FacultiesApiDecorators.Update()
  update(
    @Param('id') id: string,
    @Body() updateFacultyDto: Omit<UpdateFacultyInput, 'id'>,
  ) {
    return this.facultiesService.update(id, { ...updateFacultyDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @FacultiesApiDecorators.Delete()
  remove(@Param('id') id: string) {
    return this.facultiesService.delete(id);
  }
}
