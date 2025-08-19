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
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { QuestionsQueryDto } from './dto/question-query.dto';
import { DeleteQuestionInput } from './dto/delete-question.input';
import { Question } from './models/Question.entity';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new question', description: 'Creates a new question record.' })
  @ApiCreatedResponse({ type: Question, description: 'The newly created question.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createQuestionDto: CreateQuestionInput) {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all questions', description: 'Returns a list of all questions.' })
  @ApiOkResponse({ type: Question, isArray: true, description: 'A list of questions.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll(@Query() query: QuestionsQueryDto) {
    return this.questionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a question by ID', description: 'Returns a single question by its ID.' })
  @ApiOkResponse({ type: Question, description: 'The question with the specified ID.' })
  @ApiResponse({ status: 404, description: 'Question not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.questionsService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a question by ID', description: 'Updates an existing question record.' })
  @ApiOkResponse({ type: Question, description: 'The updated question.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Question not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: Omit<UpdateQuestionInput, 'id'>,
  ) {
    return this.questionsService.update({ ...updateQuestionDto, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a question by ID', description: 'Deletes a question record by its ID.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Question successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Question not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    const deleteQuestionInput: DeleteQuestionInput = { id };
    return this.questionsService.remove(deleteQuestionInput);
  }
}
