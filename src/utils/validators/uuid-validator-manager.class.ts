import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ValidationResult, BaseUuidValidator } from './base-uuid-validator';
import { TranslationValidator } from './translation-validator';
import { QuestionValidator } from './question-validator';
import { ModuleValidator } from './module-validator';
import { AnswerValidator } from './answer-validator';

export class UuidValidatorManager {
  private logger: Logger;
  private validators: BaseUuidValidator[];

  constructor() {
    this.logger = new Logger('UUIDValidatorManager');
    this.validators = [
      new TranslationValidator(),
      new QuestionValidator(),
      new ModuleValidator(),
      new AnswerValidator(),
    ];
  }

  async validateAndFixAllDatabaseUUIDs(
    prisma: PrismaClient,
    enableMutations: boolean,
  ): Promise<ValidationResult[]> {
    this.logger.log('Starting database UUID validation (type-safe mode)...');
    const results: ValidationResult[] = [];

    const validationTasks = this.validators.map((validator) =>
      validator.validate(prisma, enableMutations),
    );

    const allResults = await Promise.all(validationTasks);
    results.push(...allResults.filter((r) => r.invalidCount > 0));

    const totalInvalid = results.reduce((sum, r) => sum + r.invalidCount, 0);
    const totalFixed = results.reduce((sum, r) => sum + r.fixedCount, 0);

    if (enableMutations && totalFixed > 0) {
      this.logger.log(
        `✅ Fixed ${totalFixed}/${totalInvalid} invalid UUIDs in the database`,
      );
    } else if (totalInvalid > 0) {
      this.logger.warn(
        `⚠️  Found ${totalInvalid} invalid UUIDs in the database (mutations disabled, not fixing)`,
      );
    }

    return results;
  }
}