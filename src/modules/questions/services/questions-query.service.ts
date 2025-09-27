import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Question } from '../models/Question.entity';
import { QuestionsQueryDto } from '../dto/question-query.dto';
import { PaginatedQuestionsResponse } from '../dto/paginated-questions-response.dto';
import { QuestionQueryBuilder } from '../helpers/question-query-builder';
import { ModuleHierarchyHelper } from '../helpers/module-hierarchy-helper';

@Injectable()
export class QuestionsQueryService {
  private moduleHelper: ModuleHierarchyHelper;

  constructor(private readonly prisma: PrismaService) {
    this.moduleHelper = new ModuleHierarchyHelper(prisma);
  }

  async findAll(query?: QuestionsQueryDto) {
    const where = query ? QuestionQueryBuilder.buildWhereClause(query) : {};
    const include = QuestionQueryBuilder.buildInclude();

    return this.prisma.question.findMany({ where, include });
  }

  async findAllPaginated(
    query?: QuestionsQueryDto,
  ): Promise<PaginatedQuestionsResponse> {
    const where = query ? QuestionQueryBuilder.buildWhereClause(query) : {};
    const include = QuestionQueryBuilder.buildInclude();

    const page = query && query.page !== undefined ? parseInt(String(query.page), 10) : 1;
    const limit = query && query.limit !== undefined ? parseInt(String(query.limit), 10) : 10;
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        include,
        skip,
        take: limit,
      }),
      this.prisma.question.count({ where }),
    ]);

    const typedQuestions: Question[] = questions;
    return {
      questions: typedQuestions,
      totalCount: total,
      offset: skip,
      limit,
      hasMore: skip + limit < total,
    };
  }

  async findUnique(id: string): Promise<Question | null> {
    return this.prisma.question.findUnique({
      where: { id },
      include: QuestionQueryBuilder.buildInclude(),
    });
  }

  async getModulesWithFewestQuestions() {
    return this.prisma.module.findMany({
      select: { id: true, name: { select: { en_text: true } } },
      orderBy: { Questions: { _count: 'asc' } },
      take: 10,
    });
  }
}