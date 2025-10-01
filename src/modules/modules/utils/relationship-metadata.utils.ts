import { RelationshipMetadataKey } from '@prisma/client';

export interface RelationshipMetadata {
  key: string;
  value: string;
}

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

export function formatMetadata(metadata: RelationshipMetadata[]): Record<string, string> {
  return metadata ? metadata.reduce(
    (acc: Record<string, string>, meta: RelationshipMetadata) => {
      acc[meta.key] = meta.value;
      return acc;
    },
    {} satisfies Record<string, string>,
  ) : {};
}