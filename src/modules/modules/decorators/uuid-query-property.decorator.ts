import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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