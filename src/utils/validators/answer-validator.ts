import { Prisma, PrismaClient } from '@prisma/client';
import { BaseUuidValidator, ValidationResult } from './base-uuid-validator';

export class AnswerValidator extends BaseUuidValidator {
  constructor() {
    super();
  }

  async validate(
    prisma: PrismaClient,
    enableMutations: boolean,
  ): Promise<ValidationResult> {
    const result = this.createResult('Answer');

    try {
      const answers = await prisma.answer.findMany({
        include: {
          SelectAnswer: true,
          UnitAnswer: true,
          NumberAnswer: true,
          BooleanAnswer: true,
        },
      });

      for (const answer of answers) {
        if (!this.isValidUuid(answer.id)) {
          result.invalidCount++;

          if (enableMutations) {
            try {
              const newId = this.generateNewUuid();

              await prisma.$transaction(async (tx) => {
                await tx.answer.create({
                  data: {
                    id: newId,
                    questionId: answer.questionId,
                  },
                });

                await this.updateAnswerReferences(tx, answer.id, newId);
                await tx.answer.delete({ where: { id: answer.id } });
              });

              result.fixedCount++;
              this.logger.log(`Fixed Answer UUID: "${answer.id}" → "${newId}"`);
            } catch (error) {
              result.errors.push(`Failed to fix Answer ${answer.id}: ${error}`);
              this.logger.error(`Failed to fix Answer ${answer.id}:`, error);
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(`Failed to validate answers: ${error}`);
      this.logger.error('Failed to validate answers:', error);
    }

    return result;
  }

  private async updateAnswerReferences(
    tx: Prisma.TransactionClient,
    oldId: string,
    newId: string,
  ) {
    await Promise.all([
      tx.selectAnswer.updateMany({
        where: { answerId: oldId },
        data: { answerId: newId },
      }),
      tx.unitAnswer.updateMany({
        where: { answerId: oldId },
        data: { answerId: newId },
      }),
      tx.numberAnswer.updateMany({
        where: { answerId: oldId },
        data: { answerId: newId },
      }),
      tx.booleanAnswer.updateMany({
        where: { answerId: oldId },
        data: { answerId: newId },
      }),
    ]);
  }
}
