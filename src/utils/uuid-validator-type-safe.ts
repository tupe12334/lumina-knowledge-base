import { PrismaClient } from '@prisma/client';
import { validateAndFixAllDatabaseUUIDs as validateUUIDs, UuidValidatorManager } from './validators';
import { ValidationResult } from './validators/types';

/**
 * Validates and fixes all UUIDs in the database using only type-safe Prisma operations
 * Since Prisma doesn't allow updating primary keys, we:
 * 1. Create new records with valid UUIDs
 * 2. Update all foreign key references
 * 3. Delete old records
 */
export async function validateAndFixAllDatabaseUUIDs(
  prisma: PrismaClient,
  enableMutations: boolean
): Promise<ValidationResult[]> {
  return validateUUIDs(prisma, enableMutations);
}