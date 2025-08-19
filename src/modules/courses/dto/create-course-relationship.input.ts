import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * GraphQL input type for creating prerequisite/postrequisite relationships between courses.
 * Used in GraphQL mutations to specify the relationship data.
 */
@InputType()
export class CreateCourseRelationshipInput {
  /**
   * The ID of the prerequisite course.
   * This course must be completed before the postrequisite course.
   */
  @ApiProperty({ description: 'The ID of the prerequisite course' })
  @Field(() => ID, {
    description: 'The ID of the prerequisite course',
  })
  @IsUUID()
  prerequisiteCourseId: string;

  /**
   * The ID of the postrequisite course.
   * This course requires the prerequisite course to be completed first.
   */
  @ApiProperty({ description: 'The ID of the postrequisite course' })
  @Field(() => ID, {
    description: 'The ID of the postrequisite course',
  })
  @IsUUID()
  postrequisiteCourseId: string;

  /**
   * Optional metadata for the relationship.
   * Can contain additional information about the relationship such as
   * minimum grade required, completion percentage, etc.
   */
  @ApiPropertyOptional({ description: 'Optional metadata for the relationship (JSON string)' })
  @Field(() => String, {
    nullable: true,
    description: 'Optional metadata for the relationship (JSON string)',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
