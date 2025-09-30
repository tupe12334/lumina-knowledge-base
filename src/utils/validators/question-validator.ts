import { Prisma, PrismaClient } from '@prisma/client';
import { BaseUuidValidator } from './base-uuid-validator';
import { ValidationResult } from './types';

interface QuestionWithRelations {
  id: string;
  validationStatus: unknown;
  translationId: string | null;
  type: unknown;
  Modules: Array<{ id: string }>;
  Parts: Array<{ id: string }>;
  PartOf: Array<{ id: string }>;
}

export class QuestionValidator extends BaseUuidValidator {
  constructor() {
    super();
  }

  async validate(prisma: PrismaClient, enableMutations: boolean): Promise<ValidationResult> {
    const result = this.createResult('Question');
    try {
      const questions = await this.getQuestionsWithRelations(prisma);
      for (const question of questions) {
        if (!this.isValidUuid(question.id)) {
          result.invalidCount++;
          if (enableMutations) {
            await this.fixInvalidQuestion(prisma, question, result);
          }
        }
      }
    } catch (error) {
      result.errors.push(`Failed to validate questions: ${error}`);
      this.logger.error('Failed to validate questions:', error);
    }
    return result;
  }

  private async getQuestionsWithRelations(prisma: PrismaClient) {
    return prisma.question.findMany({
      include: {
        Modules: true,
        Parts: true,
        PartOf: true,
      },
    });
  }

  private async fixInvalidQuestion(prisma: PrismaClient, question: QuestionWithRelations, result: ValidationResult) {
    try {
      const newId = this.generateNewUuid();
      await this.replaceQuestionWithNewId(prisma, question, newId);
      result.fixedCount++;
      this.logger.log(`Fixed Question UUID: "${question.id}" → "${newId}"`);
    } catch (error) {
      result.errors.push(`Failed to fix Question ${question.id}: ${error}`);
      this.logger.error(`Failed to fix Question ${question.id}:`, error);
    }
  }

  private async replaceQuestionWithNewId(prisma: PrismaClient, question: QuestionWithRelations, newId: string) {
    await prisma.$transaction(async (tx) => {
      await tx.question.create({
        data: {
          id: newId,
          validationStatus: question.validationStatus,
          ...(question.translationId && { translationId: question.translationId }),
          type: question.type,
          Modules: {
            connect: question.Modules.map((m) => ({ id: m.id })),
          },
        } as any,
      });
      await this.updateQuestionReferences(tx, question.id, newId);
      await this.updateQuestionRelationships(tx, question, newId);
      await tx.question.delete({ where: { id: question.id } });
    });
  }

  private async updateQuestionReferences(tx: Prisma.TransactionClient, oldId: string, newId: string) {
    await Promise.all([
      tx.answer.updateMany({ where: { questionId: oldId }, data: { questionId: newId } }),
      tx.questionPart.updateMany({ where: { questionId: oldId }, data: { questionId: newId } }),
      tx.questionPart.updateMany({ where: { partQuestionId: oldId }, data: { partQuestionId: newId } }),
    ]);
  }

  private async updateQuestionRelationships(tx: Prisma.TransactionClient, question: QuestionWithRelations, newId: string) {
    if (question.Parts && question.Parts.length > 0) {
      await tx.questionPart.updateMany({ where: { questionId: question.id }, data: { questionId: newId } });
    }
    if (question.PartOf && question.PartOf.length > 0) {
      await tx.questionPart.updateMany({ where: { partQuestionId: question.id }, data: { partQuestionId: newId } });
    }
  }
}
