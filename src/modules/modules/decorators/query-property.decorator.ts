import { IsOptional, IsInt, Min, IsString, IsBoolean, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

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

/**
 * Creates a standard string query property decorator
 */
export const StringQueryProperty = () => {
  return function (target: object, propertyKey: string) {
    ApiPropertyOptional()(target, propertyKey);
    IsOptional()(target, propertyKey);
    IsString()(target, propertyKey);
  };
};

/**
 * Creates a standard UUID query property decorator
 */
export const UuidQueryProperty = () => {
  return function (target: object, propertyKey: string) {
    ApiPropertyOptional()(target, propertyKey);
    IsOptional()(target, propertyKey);
    IsUUID(4)(target, propertyKey);
  };
};