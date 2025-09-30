import { Injectable } from '@nestjs/common';
import { CreateCourseRelationshipInput } from '../dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from '../dto/delete-course-relationship.input';
import { CourseRelationshipResult } from '../dto/course-relationship-result.type';
import { CourseRelationshipValidatorService } from './course-relationship-validator.service';
import { CourseRelationshipDatabaseService } from './course-relationship-database.service';

@Injectable()
export class CourseRelationshipService {
  constructor(
    private readonly validator: CourseRelationshipValidatorService,
    private readonly database: CourseRelationshipDatabaseService,
  ) {}

  async createCourseRelationship(
    relationshipData: CreateCourseRelationshipInput,
  ): Promise<CourseRelationshipResult> {
    const { prerequisiteCourseId, postrequisiteCourseId, metadata } =
      relationshipData;

    this.validator.validateRelationshipInput(prerequisiteCourseId, postrequisiteCourseId);
    const [prerequisiteCourse, postrequisiteCourse] = await this.validator.validateCoursesExist(
      prerequisiteCourseId,
      postrequisiteCourseId,
    );
    await this.validator.ensureRelationshipDoesNotExist(prerequisiteCourse.Block.id, postrequisiteCourse.Block.id);
    const relationship = await this.database.createBlockRelationship(prerequisiteCourse.Block.id, postrequisiteCourse.Block.id, metadata);

    return this.database.formatRelationshipResult(relationship);
  }

  async deleteCourseRelationship(
    relationshipData: DeleteCourseRelationshipInput,
  ): Promise<CourseRelationshipResult> {
    const { prerequisiteCourseId, postrequisiteCourseId } = relationshipData;

    const [prerequisiteCourse, postrequisiteCourse] = await this.validator.validateCoursesExist(
      prerequisiteCourseId,
      postrequisiteCourseId,
    );
    const existingRelationship = await this.validator.findExistingRelationship(
      prerequisiteCourse.Block.id,
      postrequisiteCourse.Block.id,
    );
    const result = this.database.formatRelationshipResult(existingRelationship);
    await this.database.deleteBlockRelationship(prerequisiteCourse.Block.id, postrequisiteCourse.Block.id);

    return result;
  }
}