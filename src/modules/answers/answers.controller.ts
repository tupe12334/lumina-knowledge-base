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
  ApiOperation,
  ApiResponse,
  ApiParam,
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
  @ApiOperation({
    summary: 'Create a new answer',
    description: 'Creates a new answer record.',
  })
  @ApiCreatedResponse({
    type: Answer,
    description: 'The newly created answer.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createDto: CreateAnswerInput) {
    return this.answersService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all answers',
    description: 'Returns a list of all answers.',
  })
  @ApiOkResponse({
    type: Answer,
    isArray: true,
    description: 'A list of answers.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll(@Query() query: AnswersQueryDto) {
    return this.answersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve an answer by ID',
    description: 'Returns a single answer by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the answer', type: String })
  @ApiOkResponse({
    type: Answer,
    description: 'The answer with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'Answer not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.answersService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an answer by ID',
    description: 'Updates an existing answer record.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the answer', type: String })
  @ApiOkResponse({ type: Answer, description: 'The updated answer.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Answer not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(
    @Param('id') id: string,
    @Body() updateDto: Omit<UpdateAnswerInput, 'id'>,
  ) {
    return this.answersService.update({ ...updateDto, id });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an answer by ID',
    description: 'Deletes an answer record by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the answer', type: String })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Answer successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Answer not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.answersService.remove(id);
  }
}
