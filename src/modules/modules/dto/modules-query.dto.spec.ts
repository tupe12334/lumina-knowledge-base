import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ModulesQueryDto } from './modules-query.dto';

describe('ModulesQueryDto', () => {
  const createDto = (data: Record<string, unknown>) =>
    plainToClass(ModulesQueryDto, data);

  describe('minQuestions', () => {
    it('should accept valid minimum questions', async () => {
      const dto = createDto({ minQuestions: '5' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.minQuestions).toBe(5);
    });

    it('should reject negative values', async () => {
      const dto = createDto({ minQuestions: '-1' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0]?.property).toBe('minQuestions');
    });

    it('should transform string to number', () => {
      const dto = createDto({ minQuestions: '10' });
      expect(dto.minQuestions).toBe(10);
    });

    it('should handle invalid string as undefined', () => {
      const dto = createDto({ minQuestions: 'invalid' });
      expect(dto.minQuestions).toBeUndefined();
    });
  });

  describe('maxQuestions', () => {
    it('should accept valid maximum questions', async () => {
      const dto = createDto({ maxQuestions: '20' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.maxQuestions).toBe(20);
    });

    it('should reject negative values', async () => {
      const dto = createDto({ maxQuestions: '-5' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0]?.property).toBe('maxQuestions');
    });
  });

  describe('exactQuestions', () => {
    it('should accept valid exact questions count', async () => {
      const dto = createDto({ exactQuestions: '10' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.exactQuestions).toBe(10);
    });

    it('should accept zero as valid value', async () => {
      const dto = createDto({ exactQuestions: '0' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.exactQuestions).toBe(0);
    });
  });

  describe('combination filters', () => {
    it('should accept multiple valid filters', async () => {
      const dto = createDto({
        minQuestions: '5',
        maxQuestions: '15',
      });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.minQuestions).toBe(5);
      expect(dto.maxQuestions).toBe(15);
    });

    it('should accept empty object', async () => {
      const dto = createDto({});
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
