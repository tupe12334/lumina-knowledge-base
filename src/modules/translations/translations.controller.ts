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
  @ApiCreatedResponse({ type: Translation })
  create(@Body() createTranslationDto: CreateTranslationInput) {
    return this.translationsService.create(createTranslationDto);
  }

  @Get()
  @ApiOkResponse({ type: Translation, isArray: true })
  findAll() {
    return this.translationsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Translation })
  findOne(@Param('id') id: string) {
    return this.translationsService.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: Translation })
  update(
    @Param('id') id: string,
    @Body() updateTranslationDto: Omit<UpdateTranslationInput, 'id'>,
  ) {
    return this.translationsService.update(id, { ...updateTranslationDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.translationsService.remove(id);
  }
}
