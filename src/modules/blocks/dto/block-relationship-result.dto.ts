import { ApiProperty } from '@nestjs/swagger';
import { Block } from '../models/Block.entity';

export class BlockRelationshipResult {
  @ApiProperty({
    description: 'ID of the created/deleted relationship',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  id: string;

  @ApiProperty({
    description: 'The prerequisite block',
  })
  prerequisite: Block;

  @ApiProperty({
    description: 'The postrequisite block',
  })
  postrequisite: Block;

  @ApiProperty({
    description: 'Metadata associated with the relationship',
    type: 'object',
    example: {
      reason: 'Foundation concepts required',
      type: 'hard',
      description: 'Students must complete this before proceeding',
    },
  })
  metadata: Record<string, string>;
}
