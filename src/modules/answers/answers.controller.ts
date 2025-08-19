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
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { AnswersService } from './answers.service';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { AnswersQueryDto } from './dto/answers-query.dto';
import { Answer } from './models/Answer.entity';

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  @ApiCreatedResponse({ type: Answer })
  create(@Body() createDto: CreateAnswerInput) {
    return this.answersService.create(createDto);
  }

  @Get()
  @ApiOkResponse({ type: Answer, isArray: true })
  findAll(@Query() query: AnswersQueryDto) {
    return this.answersService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Answer })
  findOne(@Param('id') id: string) {
    return this.answersService.findUnique(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: Answer })
  update(
    @Param('id') id: string,
    @Body() updateDto: Omit<UpdateAnswerInput, 'id'>,
  ) {
    return this.answersService.update({ ...updateDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.answersService.remove(id);
  }
}
