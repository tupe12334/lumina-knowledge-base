import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { DisciplinesService } from './disciplines.service';
import { Discipline } from './models/Discipline.entity';

@Controller('disciplines')
export class DisciplinesController {
  constructor(private readonly disciplinesService: DisciplinesService) {}

  @Get()
  @ApiOkResponse({ type: [Discipline] })
  async getDisciplines(): Promise<Discipline[]> {
    return this.disciplinesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Discipline })
  async getDiscipline(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Discipline | null> {
    return this.disciplinesService.findUnique(id);
  }
}
