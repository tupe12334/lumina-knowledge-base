import { Block } from '../../blocks/models/Block.entity';

/**
 * Object type representing a course relationship operation result.
 * Used to return information about successful relationship operations.
 */
export class CourseRelationshipResult {
  /**
   * The ID of the created/deleted relationship.
   */
  id: string;

  /**
   * The prerequisite block.
   */
  prerequisite: Block;

  /**
   * The postrequisite block.
   */
  postrequisite: Block;

  /**
   * Metadata associated with the relationship.
   */
  metadata: string;
}
