import { ApiProperty } from '@nestjs/swagger';
import { Block } from './Block.entity';
import { RelationshipMetadata } from './RelationshipMetadata.entity';

export class BlockRelationship {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  prerequisiteId!: string;

  @ApiProperty()
  postrequisiteId!: string;

  @ApiProperty({ type: () => Block, nullable: true })
  prerequisite?: Block;

  @ApiProperty({ type: () => Block, nullable: true })
  postrequisite?: Block;

  @ApiProperty({ type: () => [RelationshipMetadata], nullable: true })
  metadata?: RelationshipMetadata[];
}
