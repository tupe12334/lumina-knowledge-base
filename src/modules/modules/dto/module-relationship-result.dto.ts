import { ApiProperty } from '@nestjs/swagger';
import { Block } from '../../blocks/models/Block.entity';

export class ModuleRelationshipResult {
  @ApiProperty({
    description: 'ID of the created/deleted relationship',
    example: '123e4567-e89b-12d3-a456-426614174002',
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
      description: 'Students must complete linear algebra before calculus',
    },
  })
  metadata: Record<string, string>;
}
