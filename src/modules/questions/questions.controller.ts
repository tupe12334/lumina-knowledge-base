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
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { QuestionsQueryDto } from './dto/question-query.dto';
import { DeleteQuestionInput } from './dto/delete-question.input';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionInput) {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  findAll(@Query() query: QuestionsQueryDto) {
    return this.questionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findUnique(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: Omit<UpdateQuestionInput, 'id'>,
  ) {
    return this.questionsService.update({ ...updateQuestionDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    const deleteQuestionInput: DeleteQuestionInput = { id };
    return this.questionsService.remove(deleteQuestionInput);
  }
}
