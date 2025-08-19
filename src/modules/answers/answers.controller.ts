import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnswersService } from './answers.service';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { AnswersQueryDto } from './dto/answers-query.dto';

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  create(@Body() createDto: CreateAnswerInput) {
    return this.answersService.create(createDto);
  }

  @Get()
  findAll(@Query() query: AnswersQueryDto) {
    return this.answersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answersService.findUnique(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: Omit<UpdateAnswerInput, 'id'>,
  ) {
    return this.answersService.update({ ...updateDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.answersService.remove(id);
  }
}
