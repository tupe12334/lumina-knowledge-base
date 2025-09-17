import { Prisma, PrismaClient } from '@prisma/client';
import { BaseUuidValidator, ValidationResult } from './base-uuid-validator';

export class TranslationValidator extends BaseUuidValidator {
  constructor() {
    super();
  }

  async validate(
    prisma: PrismaClient,
    enableMutations: boolean,
  ): Promise<ValidationResult> {
    const result = this.createResult('Translation');

    try {
      const translations = await prisma.translation.findMany();

      for (const translation of translations) {
        if (!this.isValidUuid(translation.id)) {
          result.invalidCount++;

          if (enableMutations) {
            try {
              const newId = this.generateNewUuid();

              await prisma.$transaction(async (tx) => {
                await tx.translation.create({
                  data: {
                    id: newId,
                    en_text: translation.en_text,
                    he_text: translation.he_text,
                  },
                });

                await this.updateAllReferences(tx, translation.id, newId);
                await tx.translation.delete({ where: { id: translation.id } });
              });

              result.fixedCount++;
              this.logger.log(
                `Fixed Translation UUID: "${translation.id}" → "${newId}"`,
              );
            } catch (error) {
              result.errors.push(
                `Failed to fix Translation ${translation.id}: ${error}`,
              );
              this.logger.error(
                `Failed to fix Translation ${translation.id}:`,
                error,
              );
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(`Failed to validate translations: ${error}`);
      this.logger.error('Failed to validate translations:', error);
    }

    return result;
  }

  private async updateAllReferences(
    tx: Prisma.TransactionClient,
    oldId: string,
    newId: string,
  ) {
    await Promise.all([
      tx.institution.updateMany({
        where: { translationId: oldId },
        data: { translationId: newId },
      }),
      tx.faculty.updateMany({
        where: { translationId: oldId },
        data: { translationId: newId },
      }),
      tx.faculty.updateMany({
        where: { descriptionId: oldId },
        data: { descriptionId: newId },
      }),
      tx.degree.updateMany({
        where: { translationId: oldId },
        data: { translationId: newId },
      }),
      tx.course.updateMany({
        where: { translationId: oldId },
        data: { translationId: newId },
      }),
      tx.module.updateMany({
        where: { translationId: oldId },
        data: { translationId: newId },
      }),
      tx.question.updateMany({
        where: { translationId: oldId },
        data: { translationId: newId },
      }),
      tx.selectAnswer.updateMany({
        where: { translationId: oldId },
        data: { translationId: newId },
      }),
    ]);
  }
}
