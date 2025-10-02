import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Creates a standard integer query property decorator
 */
export const IntQueryProperty = () => {
  return function (target: object, propertyKey: string) {
    ApiPropertyOptional()(target, propertyKey);
    IsOptional()(target, propertyKey);
    IsInt()(target, propertyKey);
    Min(0)(target, propertyKey);
    Transform(({ value }: { value: unknown }) => {
      const parsed = parseInt(String(value), 10);
      return isNaN(parsed) ? undefined : parsed;
    })(target, propertyKey);
  };
};