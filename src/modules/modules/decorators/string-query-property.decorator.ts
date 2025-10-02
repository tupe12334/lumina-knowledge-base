import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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