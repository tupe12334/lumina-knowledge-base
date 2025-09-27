import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Question } from '../models/Question.entity';
import { CreateQuestionInput } from '../dto/create-question.input';
import { CreateManyQuestionsInput } from '../dto/create-many-questions.input';
import { CreateCompleteQuestionsInput } from '../dto/create-complete-questions.input';
import { UpdateQuestionInput } from '../dto/update-question.input';
import { DeleteQuestionInput } from '../dto/delete-question.input';
import { QuestionQueryBuilder } from '../helpers/question-query-builder';
import { QuestionCreator } from '../helpers/question-creator';

@Injectable()
export class QuestionsCrudService {
  private questionCreator: QuestionCreator;

  constructor(private readonly prisma: PrismaService) {
    this.questionCreator = new QuestionCreator(prisma);
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
            text: { connect: { id: questionData.translationId } },
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

  async update(updateQuestionInput: UpdateQuestionInput): Promise<Question> {
    const { id, translationId, type, moduleIds, validationStatus } = updateQuestionInput;

    const existingQuestion = await this.prisma.question.findUnique({
      where: { id },
      include: { Modules: true },
    });

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    const moduleConnections = moduleIds
      ? {
          set: [],
          connect: moduleIds.map((moduleId) => ({ id: moduleId })),
        }
      : undefined;

    return this.prisma.question.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(validationStatus && { validationStatus }),
        ...(translationId && { text: { connect: { id: translationId } } }),
        ...(moduleConnections && { Modules: moduleConnections }),
      },
      include: QuestionQueryBuilder.buildInclude(),
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.question.delete({ where: { id } });
  }

  async deleteQuestion(deleteQuestionInput: DeleteQuestionInput): Promise<void> {
    const { id } = deleteQuestionInput;

    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    await this.prisma.question.delete({ where: { id } });
  }
}