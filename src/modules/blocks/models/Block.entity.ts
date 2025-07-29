import { ApiProperty } from '@nestjs/swagger';
import { Module as ModuleEntity } from '../../modules/models/Module.entity';
import { BlockRelationship } from './BlockRelationship.entity';

export class Block {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => [BlockRelationship], required: false })
  prerequisiteFor?: BlockRelationship[];

  @ApiProperty({ type: () => [BlockRelationship], required: false })
  postrequisiteOf?: BlockRelationship[];

  @ApiProperty({ type: () => [ModuleEntity], required: false })
  modules?: ModuleEntity[];
}
