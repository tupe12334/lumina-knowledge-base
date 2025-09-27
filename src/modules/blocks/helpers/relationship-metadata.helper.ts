import { RelationshipMetadataKey } from '@prisma/client';
import { RelationshipMetadata } from '../models/RelationshipMetadata.entity';

export function createValidMetadataEntries(metadata: Record<string, unknown>) {
  const validEntries: Array<{ key: RelationshipMetadataKey; value: string }> = [];
  for (const [key, value] of Object.entries(metadata)) {
    if (key === RelationshipMetadataKey.REASON ||
        key === RelationshipMetadataKey.TYPE ||
        key === RelationshipMetadataKey.DESCRIPTION) {
      const typedKey = key === RelationshipMetadataKey.REASON ? RelationshipMetadataKey.REASON :
                      key === RelationshipMetadataKey.TYPE ? RelationshipMetadataKey.TYPE :
                      RelationshipMetadataKey.DESCRIPTION;
      validEntries.push({ key: typedKey, value: String(value) });
    }
  }
  return validEntries;
}

export function formatRelationshipMetadata(metadata: RelationshipMetadata[] | undefined) {
  return metadata ? metadata.reduce(
    (acc, meta) => {
      acc[meta.key] = meta.value;
      return acc;
    },
    {} satisfies Record<string, string>,
  ) : {};
}