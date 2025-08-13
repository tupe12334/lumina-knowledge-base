import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { CreateCourseRelationshipInput } from './create-course-relationship.input';

describe('CreateCourseRelationshipInput', () => {
  it('should validate successfully with valid data', async () => {
    const input = new CreateCourseRelationshipInput();
    input.prerequisiteCourseId = '123e4567-e89b-12d3-a456-426614174000';
    input.postrequisiteCourseId = '123e4567-e89b-12d3-a456-426614174001';
    input.metadata = { reason: 'Basic knowledge required', type: 'hard' };

    const errors = await validate(input);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid prerequisite course ID', async () => {
    const input = new CreateCourseRelationshipInput();
    input.prerequisiteCourseId = 'invalid-uuid';
    input.postrequisiteCourseId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(input);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('prerequisiteCourseId');
  });

  it('should fail validation with invalid postrequisite course ID', async () => {
    const input = new CreateCourseRelationshipInput();
    input.prerequisiteCourseId = '123e4567-e89b-12d3-a456-426614174000';
    input.postrequisiteCourseId = 'invalid-uuid';

    const errors = await validate(input);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('postrequisiteCourseId');
  });

  it('should validate successfully without metadata', async () => {
    const input = new CreateCourseRelationshipInput();
    input.prerequisiteCourseId = '123e4567-e89b-12d3-a456-426614174000';
    input.postrequisiteCourseId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(input);
    expect(errors).toHaveLength(0);
  });
});
