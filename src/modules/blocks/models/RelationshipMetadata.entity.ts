import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { RelationshipMetadataKey } from './RelationshipMetadataKey.enum';

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
