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
import { CreateManyAnswersInput } from './dto/create-many-answers.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { AnswersQueryDto } from './dto/answers-query.dto';
import { Answer } from './models/Answer.entity';

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new answer' })
  @ApiCreatedResponse({ type: Answer })
  create(@Body() createDto: CreateAnswerInput) {
    return this.answersService.create(createDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple answers' })
  @ApiCreatedResponse({ description: 'Number of answers created' })
  createMany(@Body() createManyAnswersDto: CreateManyAnswersInput) {
    return this.answersService.createMany(createManyAnswersDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all answers' })
  @ApiOkResponse({ type: Answer, isArray: true })
  findAll(@Query() query: AnswersQueryDto) {
    return this.answersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an answer by ID' })
  @ApiOkResponse({ type: Answer })
  findOne(@Param('id') id: string) {
    return this.answersService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an answer by ID' })
  @ApiOkResponse({ type: Answer })
  update(
    @Param('id') id: string,
    @Body() updateDto: Omit<UpdateAnswerInput, 'id'>,
  ) {
    return this.answersService.update({ ...updateDto, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an answer by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.answersService.remove(id);
  }
}
