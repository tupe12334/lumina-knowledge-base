import { Injectable } from '@nestjs/common';
import { Question } from './models/Question.entity';
import { QuestionsQueryDto } from './dto/question-query.dto';
import { CreateQuestionInput } from './dto/create-question.input';
import { CreateManyQuestionsInput } from './dto/create-many-questions.input';
import { CreateCompleteQuestionsInput } from './dto/create-complete-questions.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { DeleteQuestionInput } from './dto/delete-question.input';
import { PaginatedQuestionsResponse } from './dto/paginated-questions-response.dto';
import { QuestionsQueryService } from './services/questions-query.service';
import { QuestionsCrudService } from './services/questions-crud.service';
import { QuestionsSummaryService } from './services/questions-summary.service';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly queryService: QuestionsQueryService,
    private readonly crudService: QuestionsCrudService,
    private readonly summaryService: QuestionsSummaryService,
  ) {}

  async create(createQuestionInput: CreateQuestionInput) {
    return this.crudService.create(createQuestionInput);
  }

  async createMany(input: CreateManyQuestionsInput) {
    return this.crudService.createMany(input);
  }

  async createCompleteMany(input: CreateCompleteQuestionsInput) {
    return this.crudService.createCompleteMany(input);
  }

  async findAll(query?: QuestionsQueryDto) {
    return this.queryService.findAll(query);
  }

  async findAllPaginated(
    query?: QuestionsQueryDto,
  ): Promise<PaginatedQuestionsResponse> {
    return this.queryService.findAllPaginated(query);
  }

  async findUnique(id: string): Promise<Question | null> {
    return this.queryService.findUnique(id);
  }

  async update(updateQuestionInput: UpdateQuestionInput): Promise<Question> {
    return this.crudService.update(updateQuestionInput);
  }

  async remove(id: string): Promise<void> {
    return this.crudService.remove(id);
  }

  async deleteQuestion(deleteQuestionInput: DeleteQuestionInput): Promise<void> {
    return this.crudService.deleteQuestion(deleteQuestionInput);
  }

  async getModulesWithFewestQuestions() {
    return this.queryService.getModulesWithFewestQuestions();
  }

  async generateSummary(id: string): Promise<string> {
    return this.summaryService.generateSummary(id);
  }
}