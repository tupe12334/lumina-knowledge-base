import { ApiProperty } from '@nestjs/swagger';
import { Module as ModuleEntity } from '../../modules/models/Module.entity';
import { BlockRelationship } from './BlockRelationship.entity';

export class Block {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => [BlockRelationship], nullable: true })
  prerequisiteFor?: BlockRelationship[];

  @ApiProperty({ type: () => [BlockRelationship], nullable: true })
  postrequisiteOf?: BlockRelationship[];

  @ApiProperty({ type: () => [ModuleEntity], nullable: true })
  modules?: ModuleEntity[];
}
