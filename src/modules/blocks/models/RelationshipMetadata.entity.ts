import { ApiProperty } from '@nestjs/swagger';
import { RelationshipMetadataKey } from './RelationshipMetadataKey.enum';

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
