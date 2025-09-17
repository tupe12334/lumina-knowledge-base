import { Prisma, PrismaClient } from '@prisma/client';
import { BaseUuidValidator, ValidationResult } from './base-uuid-validator';

export class ModuleValidator extends BaseUuidValidator {
  constructor() {
    super();
  }

  async validate(
    prisma: PrismaClient,
    enableMutations: boolean,
  ): Promise<ValidationResult> {
    const result = this.createResult('Module');

    try {
      const modules = await prisma.module.findMany({
        include: {
          Questions: true,
        },
      });

      for (const module of modules) {
        if (!this.isValidUuid(module.id)) {
          result.invalidCount++;

          if (enableMutations) {
            try {
              const newId = this.generateNewUuid();

              await prisma.$transaction(async (tx) => {
                await tx.module.create({
                  data: {
                    id: newId,
                    translationId: module.translationId,
                    blockId: module.blockId,
                    Questions: {
                      connect: module.Questions.map((q) => ({ id: q.id })),
                    },
                  },
                });

                await this.updateModuleReferences(tx, module.id, newId);
                await tx.module.delete({ where: { id: module.id } });
              });

              result.fixedCount++;
              this.logger.log(`Fixed Module UUID: "${module.id}" → "${newId}"`);
            } catch (error) {
              result.errors.push(`Failed to fix Module ${module.id}: ${error}`);
              this.logger.error(`Failed to fix Module ${module.id}:`, error);
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(`Failed to validate modules: ${error}`);
      this.logger.error('Failed to validate modules:', error);
    }

    return result;
  }

  private async updateModuleReferences(
    tx: Prisma.TransactionClient,
    oldId: string,
    newId: string,
  ) {
    // Update question-module relationships
    const questionModules = await tx.questionModule.findMany({
      where: { moduleId: oldId },
    });

    for (const qm of questionModules) {
      await tx.questionModule.update({
        where: {
          questionId_moduleId: {
            questionId: qm.questionId,
            moduleId: oldId,
          },
        },
        data: { moduleId: newId },
      });
    }
  }
}
