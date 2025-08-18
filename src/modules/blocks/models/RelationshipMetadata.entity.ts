import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import type { RelationshipMetadataKey as PrismaRelationshipMetadataKey } from 'generated/client';

export const RelationshipMetadataKey = {
  REASON: 'REASON',
  TYPE: 'TYPE',
  DESCRIPTION: 'DESCRIPTION',
} as const satisfies Record<
  keyof typeof PrismaRelationshipMetadataKey,
  PrismaRelationshipMetadataKey
>;

registerEnumType(RelationshipMetadataKey, {
  name: 'RelationshipMetadataKey',
});

@ObjectType()
export class RelationshipMetadata {
  @Field(() => ID)
  id!: string;

  @Field(() => RelationshipMetadataKey)
  key!: keyof typeof RelationshipMetadataKey;

  @Field()
  value!: string;

  @Field()
  blockRelationshipId!: string;
}
