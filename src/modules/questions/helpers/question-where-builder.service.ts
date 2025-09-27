import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { QuestionsQueryDto } from '../dto/question-query.dto';

@Injectable()
export class QuestionWhereBuilderService {
  buildQuestionWhereClause(query: QuestionsQueryDto): Prisma.QuestionWhereInput {
    const where: Prisma.QuestionWhereInput = {};

    if (query.moduleId) {
      where.Modules = {
        some: {
          id: query.moduleId,
        },
      };
    }

    if (query.validationStatus) {
      where.validationStatus = query.validationStatus;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.hasAnswers !== undefined) {
      if (query.hasAnswers) {
        where.Answer = {
          some: {},
        };
      } else {
        where.Answer = {
          none: {},
        };
      }
    }

    return where;
  }

  buildAnswerWhereClause(query: QuestionsQueryDto): Prisma.AnswerWhereInput {
    const where: Prisma.AnswerWhereInput = {};

    if (query.moduleId) {
      where.question = {
        Modules: {
          some: {
            id: query.moduleId,
          },
        },
      };
    }

    if (query.validationStatus || query.type) {
      const questionWhere: Prisma.QuestionWhereInput = {};
      if (query.validationStatus) {
        questionWhere.validationStatus = query.validationStatus;
      }
      if (query.type) {
        questionWhere.type = query.type;
      }

      where.question = where.question ? {
        ...where.question,
        ...questionWhere,
      } : questionWhere;
    }

    return where;
  }
}