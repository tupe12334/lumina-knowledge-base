import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Input type for deleting prerequisite/postrequisite relationships between courses.
 * Used in API endpoints to specify which relationship to remove.
 */
export class DeleteCourseRelationshipInput {
  /**
   * The ID of the prerequisite course.
   * Part of the relationship identifier.
   */
  @ApiProperty({ description: 'The ID of the prerequisite course' })
  @IsUUID()
  prerequisiteCourseId: string;

  /**
   * The ID of the postrequisite course.
   * Part of the relationship identifier.
   */
  @ApiProperty({ description: 'The ID of the postrequisite course' })
  @IsUUID()
  postrequisiteCourseId: string;
}
