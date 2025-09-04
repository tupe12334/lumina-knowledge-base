/**
 * Result type for course deletion operation.
 * Contains information about what was deleted during the cleanup process.
 */
export class DeleteCourseResult {
  /**
   * The ID of the deleted course.
   */
  courseId: string;

  /**
   * The name of the deleted course.
   */
  courseName: string;

  /**
   * Number of course relationships that were deleted.
   */
  deletedRelationships: number;

  /**
   * Number of modules that were orphaned and optionally deleted.
   */
  orphanedModules: number;

  /**
   * Number of questions that were orphaned and optionally deleted.
   */
  orphanedQuestions: number;

  /**
   * Whether the deletion was successful.
   */
  success: boolean;

  /**
   * Optional message providing additional details about the deletion.
   */
  message?: string;
}
