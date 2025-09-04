import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Input type for deleting prerequisite/postrequisite relationships between modules.
 * Used to specify which relationship to remove.
 */
export class DeleteModuleRelationshipInput {
  /**
   * The ID of the prerequisite module.
   * Part of the relationship identifier.
   */
  @ApiProperty({ description: 'The ID of the prerequisite module' })
  @IsUUID()
  prerequisiteModuleId: string;

  /**
   * The ID of the postrequisite module.
   * Part of the relationship identifier.
   */
  @ApiProperty({ description: 'The ID of the postrequisite module' })
  @IsUUID()
  postrequisiteModuleId: string;
}
