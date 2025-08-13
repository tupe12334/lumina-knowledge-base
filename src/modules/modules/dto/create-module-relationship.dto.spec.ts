import { describe, it, expect, beforeEach } from 'vitest';
import { validate } from 'class-validator';
import { CreateModuleRelationshipDto } from './create-module-relationship.dto';

describe('CreateModuleRelationshipDto', () => {
  let dto: CreateModuleRelationshipDto;

  beforeEach(() => {
    dto = new CreateModuleRelationshipDto();
  });

  it('should validate with valid UUIDs', async () => {
    dto.prerequisiteModuleId = '123e4567-e89b-12d3-a456-426614174000';
    dto.postrequisiteModuleId = '123e4567-e89b-12d3-a456-426614174001';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with valid UUIDs and metadata', async () => {
    dto.prerequisiteModuleId = '123e4567-e89b-12d3-a456-426614174000';
    dto.postrequisiteModuleId = '123e4567-e89b-12d3-a456-426614174001';
    dto.metadata = {
      REASON: 'Foundation concepts required',
      TYPE: 'hard',
      DESCRIPTION: 'Linear algebra is required before calculus',
    };

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
