import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class ModulesQueryDto {
  @ApiPropertyOptional({
    description: 'Filter modules by minimum number of questions',
    example: 5,
    type: 'integer',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }: { value: unknown }) => {
    const parsed = parseInt(value as string, 10);
    return isNaN(parsed) ? undefined : parsed;
  })
  minQuestions?: number;

  @ApiPropertyOptional({
    description: 'Filter modules by maximum number of questions',
    example: 20,
    type: 'integer',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }: { value: unknown }) => {
    const parsed = parseInt(value as string, 10);
    return isNaN(parsed) ? undefined : parsed;
  })
  maxQuestions?: number;

  @ApiPropertyOptional({
    description: 'Filter modules by exact number of questions',
    example: 10,
    type: 'integer',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }: { value: unknown }) => {
    const parsed = parseInt(value as string, 10);
    return isNaN(parsed) ? undefined : parsed;
  })
  exactQuestions?: number;

  @ApiPropertyOptional({
    description: 'Filter modules by course ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional({
    description: 'Filter modules by university ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  universityId?: string;

  @ApiPropertyOptional({
    description: 'Search modules by name (partial match, case insensitive)',
    example: 'calculus',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  nameSearch?: string;

  @ApiPropertyOptional({
    description: 'Filter modules that have questions',
    example: true,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  hasQuestions?: boolean;

  @ApiPropertyOptional({
    description: 'Filter modules that have prerequisites',
    example: true,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  hasPrerequisites?: boolean;

  @ApiPropertyOptional({
    description: 'Filter modules that have postrequisites',
    example: true,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  hasPostrequisites?: boolean;

  @ApiPropertyOptional({
    description: 'Filter modules that have sub-modules',
    example: true,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  hasSubModules?: boolean;

  @ApiPropertyOptional({
    description: 'Filter modules that have parent modules',
    example: true,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  hasParentModules?: boolean;
}
