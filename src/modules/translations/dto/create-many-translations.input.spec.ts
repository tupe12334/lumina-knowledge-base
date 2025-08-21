import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateManyTranslationsInput } from './create-many-translations.input';

describe('CreateManyTranslationsInput', () => {
  it('should be defined', () => {
    expect(CreateManyTranslationsInput).toBeDefined();
  });

  it('should validate with valid input', async () => {
    const input = {
      translations: [
        { en_text: 'Hello', he_text: 'שלום' },
        { en_text: 'World', he_text: 'עולם' },
      ],
    };

    const dto = plainToClass(CreateManyTranslationsInput, input);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail validation with empty array', async () => {
    const input = {
      translations: [],
    };

    const dto = plainToClass(CreateManyTranslationsInput, input);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('arrayMinSize');
  });

  it('should fail validation with missing translations property', async () => {
    const input = {};

    const dto = plainToClass(CreateManyTranslationsInput, input);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('translations');
  });

  it('should fail validation with invalid translation data', async () => {
    const input = {
      translations: [
        { en_text: '', he_text: 'שלום' }, // empty en_text
        { en_text: 'World' }, // missing he_text
      ],
    };

    const dto = plainToClass(CreateManyTranslationsInput, input);
    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('translations');
  });
});
