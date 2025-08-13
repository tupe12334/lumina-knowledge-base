import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

/**
 * Result type for course deletion operation.
 * Contains information about what was deleted during the cleanup process.
 */
@ObjectType({
  description: 'Result of a course deletion operation with cleanup details',
})
export class DeleteCourseResult {
  /**
   * The ID of the deleted course.
   */
  @Field(() => ID, {
    description: 'The ID of the deleted course',
  })
  courseId: string;

  /**
   * The name of the deleted course.
   */
  @Field(() => String, {
    description: 'The name of the deleted course',
  })
  courseName: string;

  /**
   * Number of course relationships that were deleted.
   */
  @Field(() => Int, {
    description: 'Number of course relationships deleted',
  })
  deletedRelationships: number;

  /**
   * Number of modules that were orphaned and optionally deleted.
   */
  @Field(() => Int, {
    description: 'Number of orphaned modules',
  })
  orphanedModules: number;

  /**
   * Number of questions that were orphaned and optionally deleted.
   */
  @Field(() => Int, {
    description: 'Number of orphaned questions',
  })
  orphanedQuestions: number;

  /**
   * Number of learning resources that were deleted.
   */
  @Field(() => Int, {
    description: 'Number of learning resources deleted',
  })
  deletedLearningResources: number;

  /**
   * Whether the deletion was successful.
   */
  @Field(() => Boolean, {
    description: 'Whether the deletion was successful',
  })
  success: boolean;

  /**
   * Optional message providing additional details about the deletion.
   */
  @Field(() => String, {
    description: 'Additional details about the deletion operation',
    nullable: true,
  })
  message?: string;
}
