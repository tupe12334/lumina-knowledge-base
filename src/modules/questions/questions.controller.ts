import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiNotFoundResponse, ApiQuery } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { Question } from './models/Question.entity';
import { QuestionsQueryDto } from './dto/questions-query.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOkResponse({ type: [Question] })
  @ApiQuery({
    name: 'moduleId',
    required: false,
    description: 'Filter questions by module ID',
    type: 'string',
  })
  @ApiQuery({
    name: 'courseId',
    required: false,
    description: 'Filter questions by course ID',
    type: 'string',
  })
  @ApiQuery({
    name: 'questionType',
    required: false,
    description: 'Filter questions by question type',
    enum: ['selection', 'value', 'void'],
  })
  @ApiQuery({
    name: 'excludePartQuestions',
    required: false,
    description: 'Exclude questions that are part of other questions',
    type: 'boolean',
  })
  async getQuestions(@Query() query: QuestionsQueryDto): Promise<Question[]> {
    return this.questionsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Question })
  @ApiNotFoundResponse({ description: 'Question not found' })
  async getQuestion(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Question> {
    const question = await this.questionsService.findUnique(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }
}
