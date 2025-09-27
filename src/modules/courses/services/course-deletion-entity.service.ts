import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseDeletionEntityService {
  async deleteModuleAndBlock(tx: unknown, module: unknown) {
    const typedModule = module as {
      id: string;
      Block: { id: string };
    };

    const typedTx = tx as {
      module: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
      block: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
    };

    await typedTx.module.delete({
      where: { id: typedModule.id },
    });
    await typedTx.block.delete({
      where: { id: typedModule.Block.id },
    });
  }

  async deleteModuleTranslationIfUnused(tx: unknown, module: unknown) {
    const typedModule = module as {
      translationId: string;
    };

    const typedTx = tx as {
      module: {
        findFirst: (args: { where: { translationId: string } }) => Promise<unknown | null>;
      };
      translation: {
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
    };

    const translationUsage = await typedTx.module.findFirst({
      where: { translationId: typedModule.translationId },
    });
    if (!translationUsage) {
      await typedTx.translation.delete({
        where: { id: typedModule.translationId },
      });
    }
  }
}