import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ValidationResult } from './types';

export abstract class BaseUuidValidator {
  protected logger: Logger;

  constructor() {
    this.logger = new Logger('UUIDValidator');
  }

  protected isValidUuid(id: string): boolean {
    return uuidValidate(id);
  }

  protected generateNewUuid(): string {
    return uuidv4();
  }

  protected createResult(tableName: string): ValidationResult {
    return {
      tableName,
      invalidCount: 0,
      fixedCount: 0,
      errors: [],
    };
  }

  abstract validate(prisma: PrismaClient, enableMutations: boolean): Promise<ValidationResult>;
}