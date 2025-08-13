import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { DeleteCourseRelationshipInput } from './delete-course-relationship.input';

describe('DeleteCourseRelationshipInput', () => {
  it('should validate successfully with valid data', async () => {
    const input = new DeleteCourseRelationshipInput();
    input.prerequisiteCourseId = '123e4567-e89b-12d3-a456-426614174000';
    input.postrequisiteCourseId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(input);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid prerequisite course ID', async () => {
    const input = new DeleteCourseRelationshipInput();
    input.prerequisiteCourseId = 'invalid-uuid';
    input.postrequisiteCourseId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(input);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('prerequisiteCourseId');
  });

  it('should fail validation with invalid postrequisite course ID', async () => {
    const input = new DeleteCourseRelationshipInput();
    input.prerequisiteCourseId = '123e4567-e89b-12d3-a456-426614174000';
    input.postrequisiteCourseId = 'invalid-uuid';

    const errors = await validate(input);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('postrequisiteCourseId');
  });
});
