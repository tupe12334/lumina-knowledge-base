import { Injectable } from '@nestjs/common';
import {
  CourseDeletionTransaction,
  ModuleWithBlock,
} from '../types/course-deletion.types';

@Injectable()
export class CourseDeletionEntityService {
  async deleteModuleAndBlock(tx: CourseDeletionTransaction, module: ModuleWithBlock) {
    await tx.module.delete({
      where: { id: module.id },
    });
    await tx.block.delete({
      where: { id: module.Block.id },
    });
  }

  async deleteModuleTranslationIfUnused(tx: CourseDeletionTransaction, module: { translationId: string }) {
    const translationUsage = await tx.module.findFirst({
      where: { translationId: module.translationId },
    });
    if (!translationUsage) {
      await tx.translation.delete({
        where: { id: module.translationId },
      });
    }
  }
}