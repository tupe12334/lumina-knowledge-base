import type { RelationshipMetadataKey as PrismaRelationshipMetadataKey } from '@prisma/client';

export const RelationshipMetadataKey = {
  REASON: 'REASON',
  TYPE: 'TYPE',
  DESCRIPTION: 'DESCRIPTION',
} as const satisfies Record<
  keyof typeof PrismaRelationshipMetadataKey,
  PrismaRelationshipMetadataKey
>;