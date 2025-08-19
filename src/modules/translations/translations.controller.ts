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
  ApiResponse,
} from '@nestjs/swagger';
import { TranslationsService } from './translations.service';
import { CreateTranslationInput } from './dto/create-translation.input';
import { UpdateTranslationInput } from './dto/update-translation.input';
import { Translation } from './models/Translation.entity';

@ApiTags('translations')
@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new translation', description: 'Creates a new translation record.' })
  @ApiCreatedResponse({ type: Translation, description: 'The newly created translation.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createTranslationDto: CreateTranslationInput) {
    return this.translationsService.create(createTranslationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all translations', description: 'Returns a list of all translations.' })
  @ApiOkResponse({ type: Translation, isArray: true, description: 'A list of translations.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll() {
    return this.translationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a translation by ID', description: 'Returns a single translation by its ID.' })
  @ApiOkResponse({ type: Translation, description: 'The translation with the specified ID.' })
  @ApiResponse({ status: 404, description: 'Translation not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.translationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a translation by ID', description: 'Updates an existing translation record.' })
  @ApiOkResponse({ type: Translation, description: 'The updated translation.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Translation not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id') id: string,
    @Body() updateTranslationDto: Omit<UpdateTranslationInput, 'id'>,
  ) {
    return this.translationsService.update(id, { ...updateTranslationDto, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a translation by ID', description: 'Deletes a translation record by its ID.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Translation successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Translation not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.translationsService.remove(id);
  }
}
