import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Input type for deleting a course and cleaning up all related data.
 */
@InputType({
  description: 'Input for deleting a course and all its related data',
})
export class DeleteCourseInput {
  /**
   * The unique identifier of the course to delete.
   */
  @ApiProperty({
    description: 'The unique identifier of the course to delete.',
  })
  @Field(() => ID, {
    description: 'The ID of the course to delete',
  })
  @IsUUID('4', { message: 'Course ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Course ID is required' })
  courseId: string;

  /**
   * Optional flag to force deletion even if there are dependencies.
   * When true, all related data will be cleaned up automatically.
   */
  @ApiProperty({
    description:
      'Optional flag to force deletion even if there are dependencies.',
  })
  @Field(() => Boolean, {
    description:
      'Force deletion and cleanup of all related data (default: true)',
    defaultValue: true,
  })
  force?: boolean = true;
}
