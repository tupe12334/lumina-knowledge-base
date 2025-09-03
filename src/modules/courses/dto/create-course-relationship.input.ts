import { IsUUID, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Input type for creating prerequisite/postrequisite relationships between courses.
 * Used in API endpoints to specify the relationship data.
 */
export class CreateCourseRelationshipInput {
  /**
   * The ID of the prerequisite course.
   * This course must be completed before the postrequisite course.
   */
  @ApiProperty({ description: 'The ID of the prerequisite course' })
  @IsUUID()
  prerequisiteCourseId: string;

  /**
   * The ID of the postrequisite course.
   * This course requires the prerequisite course to be completed first.
   */
  @ApiProperty({ description: 'The ID of the postrequisite course' })
  @IsUUID()
  postrequisiteCourseId: string;

  /**
   * Optional metadata for the relationship.
   * Can contain additional information about the relationship such as
   * minimum grade required, completion percentage, etc.
   */
  @ApiPropertyOptional({
    description: 'Optional metadata for the relationship (JSON string)',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
