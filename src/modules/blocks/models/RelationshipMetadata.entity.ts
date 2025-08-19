import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import type { RelationshipMetadataKey as PrismaRelationshipMetadataKey } from '@prisma/client';

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
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty({
    enum: RelationshipMetadataKey,
    enumName: 'RelationshipMetadataKey',
  })
  @Field(() => RelationshipMetadataKey)
  key!: keyof typeof RelationshipMetadataKey;

  @ApiProperty()
  @Field()
  value!: string;

  @ApiProperty()
  @Field()
  blockRelationshipId!: string;
}
