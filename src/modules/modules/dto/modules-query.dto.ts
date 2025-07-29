import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
}
