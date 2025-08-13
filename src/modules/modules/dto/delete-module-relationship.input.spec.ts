import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { DeleteModuleRelationshipInput } from './delete-module-relationship.input';

describe('DeleteModuleRelationshipInput', () => {
  it('should validate successfully with valid UUIDs', async () => {
    const input = new DeleteModuleRelationshipInput();
    input.prerequisiteModuleId = '123e4567-e89b-12d3-a456-426614174000';
    input.postrequisiteModuleId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(input);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid prerequisite module ID', async () => {
    const input = new DeleteModuleRelationshipInput();
    input.prerequisiteModuleId = 'invalid-uuid';
    input.postrequisiteModuleId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(input);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('prerequisiteModuleId');
  });

  it('should fail validation with invalid postrequisite module ID', async () => {
    const input = new DeleteModuleRelationshipInput();
    input.prerequisiteModuleId = '123e4567-e89b-12d3-a456-426614174000';
    input.postrequisiteModuleId = 'invalid-uuid';

    const errors = await validate(input);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('postrequisiteModuleId');
  });

  it('should fail validation with missing required fields', async () => {
    const input = new DeleteModuleRelationshipInput();

    const errors = await validate(input);
    expect(errors).toHaveLength(2);
    expect(errors.map((e) => e.property)).toContain('prerequisiteModuleId');
    expect(errors.map((e) => e.property)).toContain('postrequisiteModuleId');
  });
});
