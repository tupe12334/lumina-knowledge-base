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
import { TranslationsService } from './translations.service';
import { CreateTranslationInput } from './dto/create-translation.input';
import { UpdateTranslationInput } from './dto/update-translation.input';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Post()
  create(@Body() createTranslationDto: CreateTranslationInput) {
    return this.translationsService.create(createTranslationDto);
  }

  @Get()
  findAll() {
    return this.translationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.translationsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTranslationDto: Omit<UpdateTranslationInput, 'id'>,
  ) {
    return this.translationsService.update(id, { ...updateTranslationDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.translationsService.remove(id);
  }
}
