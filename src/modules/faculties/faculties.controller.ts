import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { FacultiesService } from './faculties.service';
import { Faculty } from './models/Faculty.entity';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Get('university/:universityId')
  getFacultiesByUniversity(@Param('universityId') universityId: string) {
    return this.facultiesService.getFacultiesByUniversity(universityId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: Faculty,
    description: 'Faculty details',
  })
  getFacultyById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.facultiesService.getFacultyById(id);
  }
}
