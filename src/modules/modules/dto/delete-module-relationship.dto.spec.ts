import { describe, it, expect, beforeEach } from 'vitest';
import { validate } from 'class-validator';
import { DeleteModuleRelationshipDto } from './delete-module-relationship.dto';

describe('DeleteModuleRelationshipDto', () => {
  let dto: DeleteModuleRelationshipDto;

  beforeEach(() => {
    dto = new DeleteModuleRelationshipDto();
  });

  it('should validate with valid UUIDs', async () => {
    dto.prerequisiteModuleId = '123e4567-e89b-12d3-a456-426614174000';
    dto.postrequisiteModuleId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid prerequisite module ID', async () => {
    dto.prerequisiteModuleId = 'invalid-uuid';
    dto.postrequisiteModuleId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('prerequisiteModuleId');
  });

  it('should fail validation with invalid postrequisite module ID', async () => {
    dto.prerequisiteModuleId = '123e4567-e89b-12d3-a456-426614174000';
    dto.postrequisiteModuleId = 'invalid-uuid';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('postrequisiteModuleId');
  });

  it('should fail validation with missing prerequisite module ID', async () => {
    dto.postrequisiteModuleId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('prerequisiteModuleId');
  });

  it('should fail validation with missing postrequisite module ID', async () => {
    dto.prerequisiteModuleId = '123e4567-e89b-12d3-a456-426614174000';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('postrequisiteModuleId');
  });
});
