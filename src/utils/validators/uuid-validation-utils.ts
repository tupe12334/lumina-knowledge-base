import { PrismaClient } from '@prisma/client';
import { ValidationResult } from './base-uuid-validator';
import { UuidValidatorManager } from './uuid-validator-manager.class';

/**
 * Legacy function for backward compatibility
 * Validates and fixes all database UUIDs using the UuidValidatorManager
 */
export const validateAndFixAllDatabaseUUIDs = async (
  prisma: PrismaClient,
  enableMutations: boolean,
): Promise<ValidationResult[]> => {
  const manager = new UuidValidatorManager();
  return manager.validateAndFixAllDatabaseUUIDs(prisma, enableMutations);
};