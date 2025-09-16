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
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { TranslationsService } from './translations.service';
import { CreateTranslationInput } from './dto/create-translation.input';
import { CreateManyTranslationsInput } from './dto/create-many-translations.input';
import { UpdateTranslationInput } from './dto/update-translation.input';
import { Translation } from './models/Translation.entity';

@ApiTags('translations')
@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new translation' })
  @ApiCreatedResponse({ type: Translation })
  create(@Body() createTranslationDto: CreateTranslationInput) {
    return this.translationsService.create(createTranslationDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple translations' })
  @ApiCreatedResponse({ description: 'Number of translations created' })
  createMany(@Body() createManyTranslationsDto: CreateManyTranslationsInput) {
    return this.translationsService.createMany(createManyTranslationsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all translations' })
  @ApiOkResponse({ type: Translation, isArray: true })
  findAll() {
    return this.translationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a translation by ID' })
  @ApiOkResponse({ type: Translation })
  findOne(@Param('id') id: string) {
    return this.translationsService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a translation by ID' })
  @ApiOkResponse({ type: Translation })
  update(
    @Param('id') id: string,
    @Body() updateTranslationDto: UpdateTranslationInput,
  ) {
    return this.translationsService.update(id, updateTranslationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a translation by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.translationsService.remove(id);
  }
}