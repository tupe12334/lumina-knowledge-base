import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Input type for deleting a prerequisite/postrequisite relationship between blocks.
 */
export class DeleteBlockRelationshipInput {
  /**
   * The ID of the prerequisite block.
   */
  @ApiProperty({ description: 'The ID of the prerequisite block' })
  @IsNotEmpty()
  @IsString()
  prerequisiteBlockId: string;

  /**
   * The ID of the postrequisite block.
   */
  @ApiProperty({ description: 'The ID of the postrequisite block' })
  @IsNotEmpty()
  @IsString()
  postrequisiteBlockId: string;
}
