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
import { UniversitiesService } from './universities.service';
import { CreateUniversityInput } from './dto/create-university.input';
import { UpdateUniversityInput } from './dto/update-university.input';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { University } from './models/University.entity';

@ApiTags('universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Post()
  @ApiCreatedResponse({ type: University })
  create(@Body() createUniversityDto: CreateUniversityInput) {
    return this.universitiesService.create(createUniversityDto);
  }

  @Get()
  @ApiOkResponse({ type: University, isArray: true })
  findAll() {
    return this.universitiesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: University })
  findOne(@Param('id') id: string) {
    return this.universitiesService.findUnique(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: University })
  update(
    @Param('id') id: string,
    @Body() updateUniversityDto: Omit<UpdateUniversityInput, 'id'>,
  ) {
    return this.universitiesService.update(id, { ...updateUniversityDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.universitiesService.remove(id);
  }
}
