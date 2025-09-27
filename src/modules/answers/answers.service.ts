import { Injectable } from '@nestjs/common';
import { CreateAnswerInput } from './dto/create-answer.input';
import { CreateManyAnswersInput } from './dto/create-many-answers.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { AnswersQueryDto } from './dto/answers-query.dto';
import { AnswersQueryService } from './services/answers-query.service';
import { AnswersCrudService } from './services/answers-crud.service';

@Injectable()
export class AnswersService {
  constructor(
    private readonly queryService: AnswersQueryService,
    private readonly crudService: AnswersCrudService,
  ) {}

  async findAll(query?: AnswersQueryDto) {
    return this.queryService.findAll(query);
  }

  async findUnique(id: string) {
    return this.queryService.findUnique(id);
  }

  async create(data: CreateAnswerInput) {
    return this.crudService.create(data);
  }

  async createMany(data: CreateManyAnswersInput) {
    return this.crudService.createMany(data);
  }

  async update(data: UpdateAnswerInput) {
    return this.crudService.update(data);
  }

  async delete(id: string) {
    return this.crudService.delete(id);
  }
}