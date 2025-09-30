import { RelationshipMetadata } from '../models/RelationshipMetadata.entity';

export function formatRelationshipMetadata(metadata: RelationshipMetadata[] | undefined) {
  return metadata ? metadata.reduce(
    (acc, meta) => {
      acc[meta.key] = meta.value;
      return acc;
    },
    {} satisfies Record<string, string>,
  ) : {};
}