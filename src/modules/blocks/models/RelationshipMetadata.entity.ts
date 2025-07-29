import { ApiProperty } from '@nestjs/swagger';
import type { RelationshipMetadataKey as PrismaRelationshipMetadataKey } from 'generated/client';

export const RelationshipMetadataKey = {
  REASON: 'REASON',
  TYPE: 'TYPE',
  DESCRIPTION: 'DESCRIPTION',
} as const satisfies Record<
  keyof typeof PrismaRelationshipMetadataKey,
  PrismaRelationshipMetadataKey
>;

export class RelationshipMetadata {
  @ApiProperty()
  id!: string;

  @ApiProperty({
    enum: RelationshipMetadataKey,
    enumName: 'RelationshipMetadataKey',
  })
  key!: keyof typeof RelationshipMetadataKey;

  @ApiProperty()
  value!: string;

  @ApiProperty()
  blockRelationshipId!: string;
}
