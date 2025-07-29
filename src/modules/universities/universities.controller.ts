import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UniversitiesService } from './universities.service';
import { University } from './models/University.entity';

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  @ApiOkResponse({ type: [University] })
  async getUniversities(): Promise<University[]> {
    return this.universitiesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: University })
  async getUniversity(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<University | null> {
    return this.universitiesService.findUnique(id);
  }
}
