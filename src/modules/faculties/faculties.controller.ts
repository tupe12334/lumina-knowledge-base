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
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FacultiesService } from './faculties.service';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { UpdateFacultyInput } from './dto/update-faculty.input';
import { Faculty } from './models/Faculty.entity';

@ApiTags('faculties')
@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Post()
  @ApiCreatedResponse({ type: Faculty, description: 'Faculty created' })
  create(@Body() createFacultyDto: CreateFacultyInput) {
    return this.facultiesService.create(createFacultyDto);
  }

  @Get()
  @ApiOkResponse({ type: Faculty, isArray: true })
  findAll() {
    return this.facultiesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Faculty })
  findOne(@Param('id') id: string) {
    return this.facultiesService.getFacultyById(id);
  }

  @Get('university/:universityId')
  @ApiOkResponse({ type: Faculty, isArray: true })
  findByUniversity(@Param('universityId') universityId: string) {
    return this.facultiesService.getFacultiesByUniversity(universityId);
  }

  @Put(':id')
  @ApiOkResponse({ type: Faculty })
  update(
    @Param('id') id: string,
    @Body() updateFacultyDto: Omit<UpdateFacultyInput, 'id'>,
  ) {
    return this.facultiesService.update(id, { ...updateFacultyDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Faculty deleted' })
  remove(@Param('id') id: string) {
    return this.facultiesService.delete(id);
  }
}
