import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { CreateModuleRelationshipInput } from './create-module-relationship.input';

describe('CreateModuleRelationshipInput', () => {
  it('should validate successfully with valid data', async () => {
    const input = new CreateModuleRelationshipInput();
    input.prerequisiteModuleId = '123e4567-e89b-12d3-a456-426614174000';
    input.postrequisiteModuleId = '123e4567-e89b-12d3-a456-426614174001';
    input.metadata = { minGrade: 70, requiredCompletion: true };

    const errors = await validate(input);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid prerequisite module ID', async () => {
    const input = new CreateModuleRelationshipInput();
    input.prerequisiteModuleId = 'invalid-uuid';
    input.postrequisiteModuleId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(input);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('prerequisiteModuleId');
  });

  it('should fail validation with invalid postrequisite module ID', async () => {
    const input = new CreateModuleRelationshipInput();
    input.prerequisiteModuleId = '123e4567-e89b-12d3-a456-426614174000';
    input.postrequisiteModuleId = 'invalid-uuid';

    const errors = await validate(input);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('postrequisiteModuleId');
  });

  it('should validate successfully without metadata', async () => {
    const input = new CreateModuleRelationshipInput();
    input.prerequisiteModuleId = '123e4567-e89b-12d3-a456-426614174000';
    input.postrequisiteModuleId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(input);
    expect(errors).toHaveLength(0);
  });
});
