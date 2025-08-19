import { ApiProperty } from '@nestjs/swagger';
import { Block } from '../models/Block.entity';

export class BlockRelationshipResult {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => Block })
  prerequisite: Block;

  @ApiProperty({ type: () => Block })
  postrequisite: Block;

  @ApiProperty({ type: () => Object })
  metadata: Record<string, string>;
}
