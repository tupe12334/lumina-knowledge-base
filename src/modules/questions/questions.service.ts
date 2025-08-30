import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

/* eslint-disable @typescript-eslint/no-explicit-any */

type QuestionWhereInputOrNull = Prisma.QuestionWhereInput | null;
type AnswerWhereInputOrNull = Prisma.AnswerWhereInput | null;
type QuestionsQueryDtoOrUndefined = QuestionsQueryDto | undefined;
import { PrismaService } from '../../prisma/prisma.service';
import { Question } from './models/Question.entity';
import { QuestionsQueryDto } from './dto/question-query.dto';
import { CreateQuestionInput } from './dto/create-question.input';
import { CreateManyQuestionsInput } from './dto/create-many-questions.input';
import { CreateCompleteQuestionsInput } from './dto/create-complete-questions.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { DeleteQuestionInput } from './dto/delete-question.input';
import { PaginatedQuestionsResponse } from './dto/paginated-questions-response.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Recursively get all submodule IDs for a given module ID
   */
  private async getAllSubmoduleIds(moduleId: string): Promise<string[]> {
    const submoduleIds = new Set<string>();

    const getSubmodulesRecursive = async (currentModuleId: string) => {
      const module = await this.prisma.module.findUnique({
        where: { id: currentModuleId },
        include: {
          subModules: {
            select: { id: true },
          },
        },
      });

      if (module && module.subModules) {
        for (const subModule of module.subModules) {
          if (!submoduleIds.has(subModule.id)) {
            submoduleIds.add(subModule.id);
            await getSubmodulesRecursive(subModule.id);
          }
        }
      }
    };

    await getSubmodulesRecursive(moduleId);
    return Array.from(submoduleIds);
  }

  /**
   * Build where clause for question filtering
   */
  private async buildWhereClause(
    filters?: QuestionsQueryDto,
  ): Promise<Prisma.QuestionWhereInput> {
    const where: Prisma.QuestionWhereInput = {};

    // Handle ID-based filters first (they take precedence)
    const idBasedFilter = this.buildIdBasedFilters(filters);
    if (idBasedFilter) {
      return idBasedFilter;
    }

    // Build text search filter
    this.buildTextSearchFilter(filters, where);

    // Build module-based filters
    await this.buildModuleFilters(filters, where);

    // Build question type filter
    this.buildQuestionTypeFilter(filters, where);

    // Build parts filter
    this.buildPartsFilter(filters, where);

    // Exclude part questions
    await this.excludePartQuestions(where);

    return where;
  }

  private buildIdBasedFilters(filters?: QuestionsQueryDto): QuestionWhereInputOrNull {
    if (filters && filters.ids && filters.ids.length > 0) {
      return { id: { in: filters.ids } };
    }

    if (filters && filters.id) {
      return { id: filters.id };
    }

    return null;
  }

  private buildTextSearchFilter(filters: QuestionsQueryDtoOrUndefined, where: Prisma.QuestionWhereInput) {
    if (filters && filters.textSearch && filters.textSearch.trim().length > 0) {
      const searchTerm = filters.textSearch.trim();
      where.OR = [
        {
          text: {
            en_text: {
              contains: searchTerm,
            },
          },
        },
        {
          text: {
            he_text: {
              contains: searchTerm,
            },
          },
        },
      ];
    }
  }

  private async buildModuleFilters(filters: QuestionsQueryDtoOrUndefined, where: Prisma.QuestionWhereInput) {
    const moduleIds = await this.resolveModuleIds(filters);
    const courseIds = this.resolveCourseIds(filters);

    if (moduleIds.length > 0 || courseIds.length > 0) {
      const moduleConditions: Prisma.ModuleWhereInput[] = [];

      if (moduleIds.length > 0) {
        moduleConditions.push({ id: { in: moduleIds } });
      }

      if (courseIds.length > 0) {
        moduleConditions.push({
          Course: {
            some: { id: { in: courseIds } },
          },
        });
      }

      where.Modules = {
        some: {
          OR: moduleConditions,
        },
      };
    }
  }

  private async resolveModuleIds(filters: QuestionsQueryDtoOrUndefined): Promise<string[]> {
    let moduleIds =
      (filters && filters.moduleIds) || (filters && filters.moduleId ? [filters.moduleId] : []);

    if (typeof moduleIds === 'string') {
      moduleIds = [moduleIds];
    }

    const includeSubmodules = filters && filters.includeSubmodules !== false;
    if (moduleIds.length > 0 && includeSubmodules) {
      const expandedModuleIds = new Set(moduleIds);

      for (const moduleId of moduleIds) {
        const submoduleIds = await this.getAllSubmoduleIds(moduleId);
        submoduleIds.forEach((id) => expandedModuleIds.add(id));
      }

      moduleIds = Array.from(expandedModuleIds);
    }

    return moduleIds;
  }

  private resolveCourseIds(filters: QuestionsQueryDtoOrUndefined): string[] {
    let courseIds = (filters && filters.courseIds) || (filters && filters.courseId ? [filters.courseId] : []);

    if (typeof courseIds === 'string') {
      courseIds = [courseIds];
    }

    return courseIds;
  }

  private buildQuestionTypeFilter(filters: QuestionsQueryDtoOrUndefined, where: Prisma.QuestionWhereInput) {
    let questionTypes =
      (filters && filters.questionTypes) ||
      (filters && filters.questionType ? [filters.questionType] : []);

    if (typeof questionTypes === 'string') {
      questionTypes = [questionTypes];
    }

    if (questionTypes.length > 0) {
      where.type = { in: questionTypes };
    }
  }

  private buildPartsFilter(filters: QuestionsQueryDtoOrUndefined, where: Prisma.QuestionWhereInput) {
    if (filters && filters.hasParts !== undefined) {
      if (filters.hasParts) {
        where.Parts = { some: {} };
      } else {
        where.Parts = { none: {} };
      }
    }
  }

  private async excludePartQuestions(where: Prisma.QuestionWhereInput) {
    const partQuestionIds = await this.prisma.questionPart.findMany({
      select: { partQuestionId: true, questionId: true },
      distinct: ['partQuestionId'],
    });

    const idsToExclude = partQuestionIds
      .filter((part) => part.partQuestionId !== part.questionId)
      .map((part) => part.partQuestionId);

    if (idsToExclude.length > 0) {
      const existingIdCondition = where.id;
      if (existingIdCondition) {
        where.AND = [
          { id: existingIdCondition },
          { id: { notIn: idsToExclude } },
        ];
        delete where.id;
      } else {
        where.id = { notIn: idsToExclude };
      }
    }
  }

  /**
   * Get questions with pagination
   */
  async findAllPaginated(
    filters?: QuestionsQueryDto,
  ): Promise<PaginatedQuestionsResponse> {
    if (!filters) {
      throw new Error('Filters are required for paginated queries');
    }
    if (filters.offset === undefined || filters.offset === null) {
      throw new Error('Offset is required for paginated queries');
    }
    if (filters.limit === undefined || filters.limit === null) {
      throw new Error('Limit is required for paginated queries');
    }
    const offset = parseInt(String(filters.offset), 10);
    const limit = Math.min(parseInt(String(filters.limit), 10), 100); // Cap at 100

    const where = await this.buildWhereClause(filters);

    console.log(
      '🔍 Paginated query - filters:',
      JSON.stringify(filters, null, 2),
    );
    console.log(
      '🔍 Paginated query - where clause:',
      JSON.stringify(where, null, 2),
    );

    // Get total count and questions in parallel for better performance
    const [totalCount, questions] = await Promise.all([
      this.prisma.question.count({ where }),
      this.prisma.question.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { id: 'asc' }, // Consistent ordering for pagination
        include: {
          text: true,
          Modules: { include: { name: true } },
          Answer: {
            include: {
              SelectAnswer: { include: { text: true } },
              UnitAnswer: true,
              NumberAnswer: true,
              BooleanAnswer: true,
            },
          },
          Parts: {
            orderBy: { order: 'asc' },
            include: {
              partQuestion: {
                include: {
                  text: true,
                  Answer: {
                    include: {
                      SelectAnswer: { include: { text: true } },
                      UnitAnswer: true,
                      NumberAnswer: true,
                      BooleanAnswer: true,
                    },
                  },
                },
              },
            },
          },
          PartOf: {
            orderBy: { order: 'asc' },
            include: {
              question: {
                include: {
                  text: true,
                  Answer: {
                    include: {
                      SelectAnswer: { include: { text: true } },
                      UnitAnswer: true,
                      NumberAnswer: true,
                      BooleanAnswer: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    console.log(
      `🔍 Paginated query returned ${questions.length} of ${totalCount} questions`,
    );

    const mappedQuestions = questions.map(
      ({ Answer, Modules, Parts, PartOf, ...question }) => ({
        ...question,
        Modules: Modules,
        Answer: Answer,
        Parts: Parts,
        PartOf: PartOf,
      }),
    );

    return {
      questions: mappedQuestions,
      totalCount,
      offset,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }

  async findAll(filters?: QuestionsQueryDto): Promise<Question[]> {
    const where = await this.buildWhereClause(filters);

    console.log('🔍 Service filters:', JSON.stringify(filters, null, 2));
    console.log('🔍 Final where clause:', JSON.stringify(where, null, 2));

    const questions = await this.prisma.question.findMany({
      where,
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: {
          include: {
            SelectAnswer: { include: { text: true } },
            UnitAnswer: true,
            NumberAnswer: true,
            BooleanAnswer: true,
          },
        },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
        PartOf: {
          orderBy: { order: 'asc' },
          include: {
            question: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log('🔍 Query returned', questions.length, 'questions');

    return questions.map(({ Answer, Modules, Parts, PartOf, ...question }) => ({
      ...question,
      Modules: Modules,
      Answer: Answer,
      Parts: Parts,
      PartOf: PartOf,
    }));
  }

  async findUnique(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: {
          include: {
            SelectAnswer: { include: { text: true } },
            UnitAnswer: true,
            NumberAnswer: true,
            BooleanAnswer: true,
          },
        },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
        PartOf: {
          orderBy: { order: 'asc' },
          include: {
            question: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!question) {
      return null;
    }

    const { Answer, Modules, Parts, PartOf, ...rest } = question;

    return {
      ...rest,
      Modules: Modules,
      Answer: Answer,
      Parts: Parts,
      PartOf: PartOf,
    };
  }

  async create(data: CreateQuestionInput): Promise<Question> {
    const { translationId, moduleIds, ...rest } = data;

    const question = await this.prisma.question.create({
      data: {
        ...rest,
        text: {
          connect: { id: translationId },
        },
        Modules: {
          connect: moduleIds ? moduleIds.map((id) => ({ id })) : undefined,
        },
      },
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: {
          include: {
            SelectAnswer: { include: { text: true } },
            UnitAnswer: true,
            NumberAnswer: true,
            BooleanAnswer: true,
          },
        },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
        PartOf: {
          orderBy: { order: 'asc' },
          include: {
            question: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const { Answer, Modules, Parts, PartOf, ...questionRest } = question;
    return {
      ...questionRest,
      Modules: Modules,
      Answer: Answer,
      Parts: Parts,
      PartOf: PartOf,
    };
  }

  /**
   * Creates multiple questions in a single transaction.
   * @param input - The data for creating multiple questions
   * @returns The number of questions created
   */
  async createMany(input: CreateManyQuestionsInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const questionData of input.questions) {
        const { translationId, moduleIds, ...rest } = questionData;

        await prisma.question.create({
          data: {
            ...rest,
            text: {
              connect: { id: translationId },
            },
            Modules: {
              connect: moduleIds ? moduleIds.map((id) => ({ id })) : undefined,
            },
          },
        });
        createdCount++;
      }

      return { count: createdCount };
    });
  }

  /**
   * Creates multiple complete questions with translations and answers in a single transaction.
   * @param input - The data for creating complete questions
   * @returns The number of questions created
   */
  async createCompleteMany(input: CreateCompleteQuestionsInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const questionData of input.questions) {
        const {
          en_text,
          he_text,
          type,
          moduleIds,
          validationStatus,
          selectAnswers,
          numberAnswer,
          booleanAnswer,
          unitValue,
          unit,
        } = questionData;

        if (!validationStatus) {
          throw new Error('validationStatus is required for question creation');
        }

        // 1. Create the question translation
        const translation = await prisma.translation.create({
          data: {
            en_text,
            he_text,
          },
        });

        // 2. Create the question
        const question = await prisma.question.create({
          data: {
            type,
            validationStatus,
            text: {
              connect: { id: translation.id },
            },
            Modules: {
              connect: moduleIds ? moduleIds.map((id) => ({ id })) : undefined,
            },
          },
        });

        // 3. Create answers based on question type
        if (type === 'selection' && selectAnswers && selectAnswers.length > 0) {
          // Create translations for answer options
          const answerTranslations = await Promise.all(
            selectAnswers.map((answer) =>
              prisma.translation.create({
                data: {
                  en_text: answer.en_text,
                  he_text: answer.he_text,
                },
              }),
            ),
          );

          // Create the answer with select options
          await prisma.answer.create({
            data: {
              question: { connect: { id: question.id } },
              SelectAnswer: {
                create: selectAnswers.map((answer, index) => ({
                  isCorrect: answer.is_correct,
                  text: { connect: { id: answerTranslations[index].id } },
                })),
              },
            },
          });
        } else if (type === 'boolean' && booleanAnswer !== undefined) {
          await prisma.answer.create({
            data: {
              question: { connect: { id: question.id } },
              NumberAnswer: {
                create: { value: booleanAnswer },
              },
            },
          });
        } else if (type === 'value') {
          const answerData: Prisma.AnswerCreateInput = {
            question: { connect: { id: question.id } },
          };

          if (unitValue !== undefined && unit) {
            answerData.UnitAnswer = {
              create: { value: unitValue, unit },
            };
          } else if (numberAnswer !== undefined) {
            answerData.NumberAnswer = {
              create: { value: numberAnswer },
            };
          }

          if (answerData.UnitAnswer || answerData.NumberAnswer) {
            await prisma.answer.create({ data: answerData });
          }
        }

        createdCount++;
      }

      return { count: createdCount };
    });
  }

  async update(data: UpdateQuestionInput): Promise<Question> {
    const { id, translationId, moduleIds, ...rest } = data;

    const existingQuestion = await this.prisma.question.findUnique({
      where: { id },
      include: { Modules: true },
    });

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    const disconnectModules = existingQuestion.Modules.filter(
      (module) => !(moduleIds && moduleIds.includes(module.id)),
    ).map((module) => ({ id: module.id }));

    const connectModules = moduleIds
      ? moduleIds.filter(
        (id) => !existingQuestion.Modules.some((module) => module.id === id),
      )
      .map((id) => ({ id }))
      : undefined;

    const question = await this.prisma.question.update({
      where: { id },
      data: {
        ...rest,
        ...(translationId && { text: { connect: { id: translationId } } }),
        Modules: {
          disconnect: disconnectModules,
          connect: connectModules,
        },
      },
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: {
          include: {
            SelectAnswer: { include: { text: true } },
            UnitAnswer: true,
            NumberAnswer: true,
            BooleanAnswer: true,
          },
        },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
        PartOf: {
          orderBy: { order: 'asc' },
          include: {
            question: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const { Answer, Modules, Parts, PartOf, ...questionRest } = question;
    return {
      ...questionRest,
      Modules: Modules,
      Answer: Answer,
      Parts: Parts,
      PartOf: PartOf,
    };
  }

  async remove(data: DeleteQuestionInput): Promise<Question> {
    const { id } = data;

    const questionToDelete = await this.findQuestionForDeletion(id);

    if (!questionToDelete) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    await this.deleteQuestionAnswers(questionToDelete.Answer);
    await this.disconnectQuestionFromModules(id);
    const question = await this.deleteQuestionWithIncludes(id);
    await this.cleanupUnusedTranslation(question.translationId);

    return this.formatDeletedQuestion(question);
  }

  private async findQuestionForDeletion(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: {
        Answer: {
          include: {
            SelectAnswer: true,
            UnitAnswer: true,
            NumberAnswer: true,
            BooleanAnswer: true,
          },
        },
      },
    });
  }

  private async deleteQuestionAnswers(answers: any[]) {
    for (const answer of answers) {
      await this.deleteAnswerSubTypes(answer);
      await this.prisma.answer.delete({ where: { id: answer.id } });
    }
  }

  private async deleteAnswerSubTypes(answer: any) {
    if (answer.SelectAnswer) {
      await this.prisma.selectAnswer.deleteMany({
        where: { answerId: answer.id },
      });
    }
    if (answer.UnitAnswer) {
      await this.prisma.unitAnswer.delete({ where: { answerId: answer.id } });
    }
    if (answer.NumberAnswer) {
      await this.prisma.numberAnswer.delete({
        where: { answerId: answer.id },
      });
    }
    if (answer.BooleanAnswer) {
      await this.prisma.booleanAnswer.delete({
        where: { answerId: answer.id },
      });
    }
  }

  private async disconnectQuestionFromModules(id: string) {
    await this.prisma.question.update({
      where: { id },
      data: {
        Modules: { set: [] },
      },
    });
  }

  private async deleteQuestionWithIncludes(id: string) {
    return this.prisma.question.delete({
      where: { id },
      include: {
        text: true,
        Modules: { include: { name: true } },
        Answer: {
          include: {
            SelectAnswer: { include: { text: true } },
            UnitAnswer: true,
            NumberAnswer: true,
            BooleanAnswer: true,
          },
        },
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
        PartOf: {
          orderBy: { order: 'asc' },
          include: {
            question: {
              include: {
                text: true,
                Answer: {
                  include: {
                    SelectAnswer: { include: { text: true } },
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  private async cleanupUnusedTranslation(translationId: string) {
    const translationUsage = await this.prisma.translation.findUnique({
      where: { id: translationId },
      include: {
        Institution: true,
        Course: true,
        Module: true,
        Question: true,
        Degree: true,
        FacultyName: true,
        FacultyDescription: true,
        SelectAnswer: true,
      },
    });

    const isTranslationUsed = Object.values(translationUsage || {}).some(
      (value) => Array.isArray(value) && value.length > 0,
    );

    if (!isTranslationUsed) {
      await this.prisma.translation.delete({
        where: { id: translationId },
      });
    }
  }

  private formatDeletedQuestion(question: any) {
    const { Answer, Modules, Parts, PartOf, ...questionRest } = question;
    return {
      ...questionRest,
      Modules: Modules,
      Answer: Answer,
      Parts: Parts,
      PartOf: PartOf,
    };
  }

  /**
   * Generates a human-readable summary of a question including its type, modules, answers, and parts.
   * @param id - The question ID
   * @returns A plain text summary of the question
   * @throws NotFoundException if the question doesn't exist
   * @throws InternalServerErrorException if database operation fails
   */
  async generateSummary(id: string): Promise<string> {
    try {
      const question = await this.findQuestionForSummary(id);

      if (!question) {
        throw new NotFoundException(`Question with ID ${id} not found`);
      }

      const summaryData = this.extractQuestionSummaryData(question);
      return this.buildQuestionSummary(question, summaryData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to generate question summary: ${error.message}`,
      );
    }
  }

  private async findQuestionForSummary(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: {
        text: true,
        Modules: {
          include: {
            name: true,
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
        Parts: {
          orderBy: { order: 'asc' },
          include: {
            partQuestion: {
              include: {
                text: true,
              },
            },
          },
        },
      },
    });
  }

  private extractQuestionSummaryData(question: any) {
    const questionText =
      (question.text && question.text.en_text) || 'No English translation available';
    const validationStatus = question.validationStatus || 'Unknown';

    const moduleNames = question.Modules.map(
      (module: any) => (module.name && module.name.en_text) || 'No English translation available',
    ).join(', ');

    const answerInfo = this.buildAnswerInfo(question);
    const questionParts = this.buildQuestionParts(question);

    return {
      questionText,
      validationStatus,
      moduleNames,
      answerInfo,
      questionParts,
    };
  }

  private buildAnswerInfo(question: any): string {
    if (question.type === 'selection' && question.Answer.length > 0) {
      return this.buildSelectionAnswerInfo(question.Answer);
    } else if (question.type === 'boolean' && question.Answer.length > 0) {
      return this.buildBooleanAnswerInfo(question.Answer);
    } else if (question.type === 'value' && question.Answer.length > 0) {
      return this.buildValueAnswerInfo(question.Answer);
    } else if (question.type === 'void') {
      return 'Answer Type: No specific answer required (void type)';
    } else {
      return 'Answer Type: No answers defined';
    }
  }

  private buildSelectionAnswerInfo(answers: any[]): string {
    const answerStrings = answers.map((answer) => {
      const selectAnswers = answer.SelectAnswer.map(
        (sa: any) =>
          `${(sa.text && sa.text.en_text) || 'No English translation available'}${sa.isCorrect ? ' (correct)' : ''}`,
      ).join(', ');
      return selectAnswers;
    })
      .filter((a) => a)
      .join('; ');
    return `Answer Options: ${answerStrings}`;
  }

  private buildBooleanAnswerInfo(answers: any[]): string {
    const booleanAnswers = answers.map((answer) => {
      const booleanAnswer = answer.BooleanAnswer;
      if (booleanAnswer && booleanAnswer.value !== undefined) {
        return `Correct Answer: ${booleanAnswer.value ? 'Yes/True' : 'No/False'}`;
      }
      return '';
    })
      .filter((a) => a)
      .join('; ');
    return `Boolean Answer: ${booleanAnswers}`;
  }

  private buildValueAnswerInfo(answers: any[]): string {
    const valueAnswers = answers.map((answer) => {
      if (answer.UnitAnswer) {
        return `Unit: ${answer.UnitAnswer.unit}, Value: ${answer.UnitAnswer.value}`;
      } else if (answer.NumberAnswer) {
        return `Number, Value: ${answer.NumberAnswer.value}`;
      }
      return '';
    })
      .filter((a) => a)
      .join('; ');
    return `Answer Type: ${valueAnswers}`;
  }

  private buildQuestionParts(question: any): string {
    return question.Parts.length > 0
      ? question.Parts.map(
          (part: any) =>
            (part.partQuestion && part.partQuestion.text && part.partQuestion.text.en_text) ||
            'No English translation available',
        ).join('; ')
      : 'None';
  }

  private buildQuestionSummary(question: any, data: any): string {
    return `Question: ${data.questionText}
ID: ${question.id}
Type: ${question.type}
Validation Status: ${data.validationStatus}
Associated Modules: ${data.moduleNames || 'None'}
${data.answerInfo}
Question Parts: ${data.questionParts}`;
  }
}
