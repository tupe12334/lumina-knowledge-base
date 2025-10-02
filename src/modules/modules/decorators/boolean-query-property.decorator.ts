import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Creates a standard boolean query property decorator
 */
export const BooleanQueryProperty = () => {
  return function (target: object, propertyKey: string) {
    ApiPropertyOptional()(target, propertyKey);
    IsOptional()(target, propertyKey);
    IsBoolean()(target, propertyKey);
    Transform(({ value }: { value: unknown }) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value.toLowerCase() === 'true';
      return undefined;
    })(target, propertyKey);
  };
};