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

      if (module?.subModules) {
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

    // Handle specific question IDs filter
    if (filters?.ids && filters.ids.length > 0) {
      where.id = { in: filters.ids };
      return where; // If specific IDs are provided, ignore other filters
    }

    // Handle single ID filter
    if (filters?.id) {
      where.id = filters.id;
      return where;
    }

    // Handle text search (SQLite doesn't support mode: 'insensitive')
    if (filters?.textSearch && filters.textSearch.trim().length > 0) {
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

    // Handle both array and single module filtering
    let moduleIds =
      filters?.moduleIds || (filters?.moduleId ? [filters.moduleId] : []);

    // If module filtering is requested and includeSubmodules is enabled, expand to include all submodules
    const includeSubmodules = filters?.includeSubmodules === true;
    if (moduleIds.length > 0 && includeSubmodules) {
      const expandedModuleIds = new Set(moduleIds);

      // For each module, get all its submodules recursively
      for (const moduleId of moduleIds) {
        const submoduleIds = await this.getAllSubmoduleIds(moduleId);
        submoduleIds.forEach((id) => expandedModuleIds.add(id));
      }

      moduleIds = Array.from(expandedModuleIds);
    }

    // Handle both array and single course filtering
    const courseIds =
      filters?.courseIds || (filters?.courseId ? [filters.courseId] : []);

    // Build Module filter combining both module and course filters
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
          AND: moduleConditions,
        },
      };
    }

    // Handle both array and single question type filtering
    const questionTypes =
      filters?.questionTypes ||
      (filters?.questionType ? [filters.questionType] : []);
    if (questionTypes.length > 0) {
      where.type = { in: questionTypes };
    }

    // Handle hasParts filter
    if (filters?.hasParts !== undefined) {
      if (filters.hasParts) {
        where.Parts = { some: {} };
      } else {
        where.Parts = { none: {} };
      }
    }

    // Always exclude questions that are part of other questions
    const partQuestionIds = await this.prisma.questionPart.findMany({
      select: { partQuestionId: true, questionId: true },
      distinct: ['partQuestionId'],
    });

    // Only exclude questions that are parts of OTHER questions (not themselves)
    const idsToExclude = partQuestionIds
      .filter((part) => part.partQuestionId !== part.questionId)
      .map((part) => part.partQuestionId);

    if (idsToExclude.length > 0) {
      const existingIdCondition = where.id;
      if (existingIdCondition) {
        // If there's already an ID condition, combine with AND
        where.AND = [
          { id: existingIdCondition },
          { id: { notIn: idsToExclude } },
        ];
        delete where.id;
      } else {
        where.id = { notIn: idsToExclude };
      }
    }

    return where;
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
          connect: moduleIds?.map((id) => ({ id })),
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
              connect: moduleIds?.map((id) => ({ id })),
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
              connect: moduleIds?.map((id) => ({ id })),
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
          const answerData: any = {
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
      (module) => !moduleIds?.includes(module.id),
    ).map((module) => ({ id: module.id }));

    const connectModules = moduleIds
      ?.filter(
        (id) => !existingQuestion.Modules.some((module) => module.id === id),
      )
      .map((id) => ({ id }));

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

    const questionToDelete = await this.prisma.question.findUnique({
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

    if (!questionToDelete) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Delete related answers first
    for (const answer of questionToDelete.Answer) {
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
      // Type assertion needed until Prisma types are fully updated
      if ((answer as any).BooleanAnswer) {
        await this.prisma.booleanAnswer.delete({
          where: { answerId: answer.id },
        });
      }
      await this.prisma.answer.delete({ where: { id: answer.id } });
    }

    // Disconnect from modules
    await this.prisma.question.update({
      where: { id },
      data: {
        Modules: { set: [] },
      },
    });

    // Delete the question itself
    const question = await this.prisma.question.delete({
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

    // Delete the associated translation if it's no longer used by other entities
    const translationUsage = await this.prisma.translation.findUnique({
      where: { id: question.translationId },
      include: {
        University: true,
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
        where: { id: question.translationId },
      });
    }

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
      const question = await this.prisma.question.findUnique({
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

      if (!question) {
        throw new NotFoundException(`Question with ID ${id} not found`);
      }

      const questionText =
        question.text?.en_text || 'No English translation available';
      const validationStatus = question.validationStatus || 'Unknown';

      // Build associated modules
      const moduleNames = question.Modules.map(
        (module) => module.name?.en_text || 'No English translation available',
      ).join(', ');

      // Build answer information based on question type
      let answerInfo = '';
      if (question.type === 'selection' && question.Answer.length > 0) {
        const answers = question.Answer.map((answer) => {
          const selectAnswers = answer.SelectAnswer.map(
            (sa) =>
              `${sa.text?.en_text || 'No English translation available'}${sa.isCorrect ? ' (correct)' : ''}`,
          ).join(', ');
          return selectAnswers;
        })
          .filter((a) => a)
          .join('; ');
        answerInfo = `Answer Options: ${answers}`;
      } else if (question.type === 'boolean' && question.Answer.length > 0) {
        const booleanAnswers = question.Answer.map((answer) => {
          // Type assertion needed until Prisma types are fully updated
          const booleanAnswer = (answer as any).BooleanAnswer;
          if (booleanAnswer) {
            return `Correct Answer: ${booleanAnswer.value ? 'Yes/True' : 'No/False'}`;
          }
          return '';
        })
          .filter((a) => a)
          .join('; ');
        answerInfo = `Boolean Answer: ${booleanAnswers}`;
      } else if (question.type === 'value' && question.Answer.length > 0) {
        const valueAnswers = question.Answer.map((answer) => {
          if (answer.UnitAnswer) {
            return `Unit: ${answer.UnitAnswer.unit}, Value: ${answer.UnitAnswer.value}`;
          } else if (answer.NumberAnswer) {
            return `Number, Value: ${answer.NumberAnswer.value}`;
          }
          return '';
        })
          .filter((a) => a)
          .join('; ');
        answerInfo = `Answer Type: ${valueAnswers}`;
      } else if (question.type === 'void') {
        answerInfo = 'Answer Type: No specific answer required (void type)';
      } else {
        answerInfo = 'Answer Type: No answers defined';
      }

      // Build question parts information
      const questionParts =
        question.Parts.length > 0
          ? question.Parts.map(
              (part) =>
                part.partQuestion?.text?.en_text ||
                'No English translation available',
            ).join('; ')
          : 'None';

      const summary = `Question: ${questionText}
ID: ${question.id}
Type: ${question.type}
Validation Status: ${validationStatus}
Associated Modules: ${moduleNames || 'None'}
${answerInfo}
Question Parts: ${questionParts}`;

      return summary;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to generate question summary: ${error.message}`,
      );
    }
  }
}
