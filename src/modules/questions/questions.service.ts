import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Question } from './models/Question.entity';
import { QuestionsQueryDto } from './dto/question-query.dto';
import { CreateQuestionInput } from './dto/create-question.input';
import { CreateManyQuestionsInput } from './dto/create-many-questions.input';
import { CreateCompleteQuestionsInput } from './dto/create-complete-questions.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { DeleteQuestionInput } from './dto/delete-question.input';
import { PaginatedQuestionsResponse } from './dto/paginated-questions-response.dto';
import { QuestionQueryBuilder } from './helpers/question-query-builder';
import { QuestionCreator } from './helpers/question-creator';
import { ModuleHierarchyHelper } from './helpers/module-hierarchy-helper';

@Injectable()
export class QuestionsService {
  private questionCreator: QuestionCreator;
  private moduleHelper: ModuleHierarchyHelper;

  constructor(private readonly prisma: PrismaService) {
    this.questionCreator = new QuestionCreator(prisma);
    this.moduleHelper = new ModuleHierarchyHelper(prisma);
  }

  async create(createQuestionInput: CreateQuestionInput) {
    const { translationId, type, moduleIds, validationStatus } = createQuestionInput;

    return this.prisma.question.create({
      data: {
        type,
        validationStatus,
        text: {
          connect: { id: translationId },
        },
        Modules: moduleIds
          ? { connect: moduleIds.map((id) => ({ id })) }
          : undefined,
      },
      include: QuestionQueryBuilder.buildInclude(),
    });
  }

  async createMany(input: CreateManyQuestionsInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const questionData of input.questions) {
        await prisma.question.create({
          data: {
            type: questionData.type,
            validationStatus: questionData.validationStatus,
            text: {
              connect: { id: questionData.translationId },
            },
            Modules: questionData.moduleIds
              ? { connect: questionData.moduleIds.map((id) => ({ id })) }
              : undefined,
          },
        });
        createdCount++;
      }

      return { count: createdCount };
    });
  }

  async createCompleteMany(input: CreateCompleteQuestionsInput) {
    return this.questionCreator.createCompleteMany(input);
  }

  async findAll(query?: QuestionsQueryDto) {
    const where = query ? QuestionQueryBuilder.buildWhereClause(query) : {};
    const include = QuestionQueryBuilder.buildInclude();
    const orderBy = QuestionQueryBuilder.buildOrderBy();

    return this.prisma.question.findMany({
      where,
      include,
      orderBy,
    });
  }

  async findAllPaginated(
    query?: QuestionsQueryDto,
  ): Promise<PaginatedQuestionsResponse> {
    const page = (query && query.page) || 1;
    const limit = Math.min((query && query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where = query ? QuestionQueryBuilder.buildWhereClause(query) : {};
    const include = QuestionQueryBuilder.buildInclude();
    const orderBy = QuestionQueryBuilder.buildOrderBy();

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        include,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.question.count({ where }),
    ]);

    return {
      questions: questions,
      totalCount: total,
      offset: (page - 1) * limit,
      limit: limit,
      hasMore: (page - 1) * limit + questions.length < total,
    };
  }

  async findUnique(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: QuestionQueryBuilder.buildInclude(),
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(updateQuestionInput: UpdateQuestionInput): Promise<Question> {
    const { id, translationId, type, moduleIds, validationStatus } = updateQuestionInput;

    const exists = await this.prisma.question.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    const updateData: Prisma.QuestionUpdateInput = {};

    if (translationId) {
      updateData.text = { connect: { id: translationId } };
    }

    if (type) updateData.type = type;
    if (validationStatus) updateData.validationStatus = validationStatus;
    if (moduleIds) {
      updateData.Modules = {
        set: moduleIds.map((id) => ({ id })),
      };
    }

    return this.prisma.question.update({
      where: { id },
      data: updateData,
      include: QuestionQueryBuilder.buildInclude(),
    });
  }

  async remove(id: string): Promise<void> {
    const exists = await this.prisma.question.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    await this.prisma.question.delete({ where: { id } });
  }

  async deleteQuestion(
    input: DeleteQuestionInput,
  ): Promise<{ deletedQuestion: Question }> {
    const { id } = input;

    const question = await this.findUnique(id);
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    await this.remove(id);

    return { deletedQuestion: question };
  }

  async getModulesWithFewestQuestions() {
    return this.moduleHelper.getModulesWithFewestQuestions();
  }

  async generateSummary(id: string): Promise<string> {
    try {
      const question = await this.findUnique(id);
      if (!question) {
        throw new NotFoundException(`Question with ID ${id} not found`);
      }

      return `Question Summary for ${id}:
        Text: ${question.text && question.text.en_text ? question.text.en_text : 'No text available'}
        Type: ${question.type}
        Validation Status: ${question.validationStatus}
        Modules: ${question.Modules && question.Modules.length > 0 ? question.Modules.map(m => m.name && m.name.en_text ? m.name.en_text : 'Unnamed').join(', ') : 'None'}
        Answers: ${question.Answer && question.Answer.length ? question.Answer.length : 0} answer(s)`;
    } catch (error: unknown) {
      if (error instanceof NotFoundException && error instanceof Error) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Failed to generate summary for question ${id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
