import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, Query, ParseUUIDPipe, NotFoundException, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionInput } from './dto/create-question.input';
import { CreateManyQuestionsInput } from './dto/create-many-questions.input';
import { CreateCompleteQuestionsInput } from './dto/create-complete-questions.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { QuestionsQueryDto } from './dto/question-query.dto';
import { DeleteQuestionInput } from './dto/delete-question.input';
import { Question } from './models/Question.entity';
import { PaginatedQuestionsResponse } from './dto/paginated-questions-response.dto';
import { QuestionsApiDecorators } from './decorators/questions-api.decorators';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @QuestionsApiDecorators.CreateQuestion()
  create(@Body() createQuestionDto: CreateQuestionInput) {
    return this.questionsService.create(createQuestionDto);
  }

  @Post('bulk')
  @QuestionsApiDecorators.CreateMany()
  createMany(@Body() createManyQuestionsDto: CreateManyQuestionsInput) {
    return this.questionsService.createMany(createManyQuestionsDto);
  }

  @Post('bulk-complete')
  @QuestionsApiDecorators.CreateCompleteQuestions()
  createCompleteMany(
    @Body() createCompleteQuestionsDto: CreateCompleteQuestionsInput,
  ) {
    return this.questionsService.createCompleteMany(createCompleteQuestionsDto);
  }

  @Get()
  @QuestionsApiDecorators.FindAll()
  findAll(@Query() query: QuestionsQueryDto) {
    return this.questionsService.findAll(query);
  }

  @Get('paginated')
  @QuestionsApiDecorators.FindAllPaginated()
  findAllPaginated(@Query() query: QuestionsQueryDto) {
    return this.questionsService.findAllPaginated(query);
  }

  @Get(':id')
  @QuestionsApiDecorators.FindOne()
  findOne(@Param('id') id: string) {
    return this.questionsService.findUnique(id);
  }

  @Put(':id')
  @QuestionsApiDecorators.Update()
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: Omit<UpdateQuestionInput, 'id'>,
  ) {
    return this.questionsService.update({ ...updateQuestionDto, id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @QuestionsApiDecorators.Delete()
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }

  @Get(':id/summary')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @QuestionsApiDecorators.GetSummary()
  async getSummary(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<string> {
    try {
      return await this.questionsService.generateSummary(id);
    } catch (err: unknown) {
      if (err instanceof NotFoundException && err instanceof Error) {
        throw new NotFoundException(err.message);
      }
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes('not found')) {
        throw new NotFoundException(message);
      }
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
}
