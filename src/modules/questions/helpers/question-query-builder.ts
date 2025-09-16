import { Prisma } from '@prisma/client';
import { QuestionsQueryDto } from '../dto/question-query.dto';

export class QuestionQueryBuilder {
  static buildWhereClause(query: QuestionsQueryDto): Prisma.QuestionWhereInput {
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
          isNot: null,
        };
      } else {
        where.Answer = {
          is: null,
        };
      }
    }

    return where;
  }

  static buildAnswerWhereClause(query: QuestionsQueryDto): Prisma.AnswerWhereInput {
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

    if (query.validationStatus) {
      where.question = {
        ...where.question,
        validationStatus: query.validationStatus,
      };
    }

    if (query.type) {
      where.question = {
        ...where.question,
        type: query.type,
      };
    }

    return where;
  }

  static buildInclude() {
    return {
      text: true,
      Modules: {
        include: {
          name: true,
        },
      },
      Parts: {
        include: {
          text: true,
        },
      },
      PartOf: {
        include: {
          text: true,
        },
      },
      Answer: {
        include: {
          SelectAnswer: {
            include: {
              text: true,
            },
          },
          UnitAnswer: true,
          NumberAnswer: true,
          BooleanAnswer: true,
        },
      },
    };
  }

  static buildOrderBy(): Prisma.QuestionOrderByWithRelationInput[] {
    return [
      {
        text: {
          en_text: 'asc',
        },
      },
      {
        id: 'asc',
      },
    ];
  }
}