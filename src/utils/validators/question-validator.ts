import { PrismaClient } from '@prisma/client';
import { BaseUuidValidator, ValidationResult } from './base-uuid-validator';

export class QuestionValidator extends BaseUuidValidator {
  async validate(prisma: PrismaClient, enableMutations: boolean): Promise<ValidationResult> {
    const result = this.createResult('Question');

    try {
      const questions = await prisma.question.findMany({
        include: {
          Modules: true,
          Parts: true,
          PartOf: true,
        },
      });

      for (const question of questions) {
        if (!this.isValidUuid(question.id)) {
          result.invalidCount++;

          if (enableMutations) {
            try {
              const newId = this.generateNewUuid();

              await prisma.$transaction(async (tx) => {
                await tx.question.create({
                  data: {
                    id: newId,
                    validationStatus: question.validationStatus,
                    translationId: question.translationId,
                    type: question.type,
                    Modules: {
                      connect: question.Modules.map(m => ({ id: m.id })),
                    },
                  },
                });

                await this.updateQuestionReferences(tx, question.id, newId);
                await this.updateQuestionRelationships(tx, question, newId);
                await tx.question.delete({ where: { id: question.id } });
              });

              result.fixedCount++;
              this.logger.log(`Fixed Question UUID: "${question.id}" → "${newId}"`);
            } catch (error) {
              result.errors.push(`Failed to fix Question ${question.id}: ${error}`);
              this.logger.error(`Failed to fix Question ${question.id}:`, error);
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(`Failed to validate questions: ${error}`);
      this.logger.error('Failed to validate questions:', error);
    }

    return result;
  }

  private async updateQuestionReferences(tx: PrismaClient, oldId: string, newId: string) {
    await Promise.all([
      tx.answer.updateMany({
        where: { questionId: oldId },
        data: { questionId: newId },
      }),
      tx.questionPart.updateMany({
        where: { questionId: oldId },
        data: { questionId: newId },
      }),
      tx.questionPart.updateMany({
        where: { partOfId: oldId },
        data: { partOfId: newId },
      }),
    ]);
  }

  private async updateQuestionRelationships(tx: PrismaClient, question: any, newId: string) {
    if (question.Parts && question.Parts.length > 0) {
      await tx.questionPart.updateMany({
        where: { questionId: question.id },
        data: { questionId: newId },
      });
    }

    if (question.PartOf && question.PartOf.length > 0) {
      await tx.questionPart.updateMany({
        where: { partOfId: question.id },
        data: { partOfId: newId },
      });
    }
  }
}