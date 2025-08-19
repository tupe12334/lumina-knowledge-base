import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * GraphQL input type for deleting prerequisite/postrequisite relationships between courses.
 * Used in GraphQL mutations to specify which relationship to remove.
 */
@InputType()
export class DeleteCourseRelationshipInput {
  /**
   * The ID of the prerequisite course.
   * Part of the relationship identifier.
   */
  @ApiProperty({ description: 'The ID of the prerequisite course' })
  @Field(() => ID, {
    description: 'The ID of the prerequisite course',
  })
  @IsUUID()
  prerequisiteCourseId: string;

  /**
   * The ID of the postrequisite course.
   * Part of the relationship identifier.
   */
  @ApiProperty({ description: 'The ID of the postrequisite course' })
  @Field(() => ID, {
    description: 'The ID of the postrequisite course',
  })
  @IsUUID()
  postrequisiteCourseId: string;
}
