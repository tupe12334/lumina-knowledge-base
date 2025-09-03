import { IsNotEmpty, IsOptional, IsObject, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Input type for creating a prerequisite/postrequisite relationship between blocks.
 */
export class CreateBlockRelationshipInput {
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

  /**
   * Optional metadata for the relationship.
   */
  @ApiPropertyOptional({
    description: 'Optional metadata for the relationship (JSON string)',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
