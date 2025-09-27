import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { QuestionsQueryDto } from '../dto/question-query.dto';
import { QuestionWhereBuilderService } from './question-where-builder.service';
import { QuestionIncludeBuilderService } from './question-include-builder.service';
import { QuestionOrderBuilderService } from './question-order-builder.service';

@Injectable()
export class QuestionQueryBuilder {
  constructor(
    private readonly whereBuilder: QuestionWhereBuilderService,
    private readonly includeBuilder: QuestionIncludeBuilderService,
    private readonly orderBuilder: QuestionOrderBuilderService,
  ) {}
  buildWhereClause(query: QuestionsQueryDto): Prisma.QuestionWhereInput {
    return this.whereBuilder.buildQuestionWhereClause(query);
  }

  buildAnswerWhereClause(query: QuestionsQueryDto): Prisma.AnswerWhereInput {
    return this.whereBuilder.buildAnswerWhereClause(query);
  }

  buildInclude() {
    return this.includeBuilder.buildQuestionInclude();
  }

  buildOrderBy(): Prisma.QuestionOrderByWithRelationInput[] {
    return this.orderBuilder.buildOrderBy();
  }
}