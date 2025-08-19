import { ApiProperty } from '@nestjs/swagger';
import { Block } from '../../blocks/models/Block.entity';

export class ModuleRelationshipResult {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => Block })
  prerequisite: Block;

  @ApiProperty({ type: () => Block })
  postrequisite: Block;

  @ApiProperty({ type: () => Object })
  metadata: Record<string, string>;
}
