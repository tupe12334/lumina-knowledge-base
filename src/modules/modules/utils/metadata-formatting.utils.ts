import { RelationshipMetadata } from './relationship-metadata.types';

export function formatMetadata(metadata: RelationshipMetadata[]): Record<string, string> {
  return metadata ? metadata.reduce(
    (acc: Record<string, string>, meta: RelationshipMetadata) => {
      acc[meta.key] = meta.value;
      return acc;
    },
    {} satisfies Record<string, string>,
  ) : {};
}