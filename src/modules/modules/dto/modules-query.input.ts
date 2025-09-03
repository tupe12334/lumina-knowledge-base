import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class ModulesQueryInput {
  @ApiPropertyOptional({
    description: 'Filter modules by minimum number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minQuestions?: number;

  @ApiPropertyOptional({
    description: 'Filter modules by maximum number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxQuestions?: number;

  @ApiPropertyOptional({
    description: 'Filter modules by exact number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  exactQuestions?: number;

  @ApiPropertyOptional({ description: 'Filter modules by course ID' })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional({ description: 'Filter modules by institution ID' })
  @IsOptional()
  @IsUUID()
  universityId?: string;

  @ApiPropertyOptional({
    description: 'Search modules by name (partial match, case insensitive)',
  })
  @IsOptional()
  @IsString()
  nameSearch?: string;

  @ApiPropertyOptional({ description: 'Filter modules that have questions' })
  @IsOptional()
  @IsBoolean()
  hasQuestions?: boolean;

  @ApiPropertyOptional({
    description: 'Filter modules that have prerequisites',
  })
  @IsOptional()
  @IsBoolean()
  hasPrerequisites?: boolean;

  @ApiPropertyOptional({
    description: 'Filter modules that have postrequisites',
  })
  @IsOptional()
  @IsBoolean()
  hasPostrequisites?: boolean;

  @ApiPropertyOptional({ description: 'Filter modules that have sub-modules' })
  @IsOptional()
  @IsBoolean()
  hasSubModules?: boolean;

  @ApiPropertyOptional({
    description: 'Filter modules that have parent modules',
  })
  @IsOptional()
  @IsBoolean()
  hasParentModules?: boolean;

  @ApiPropertyOptional({
    description: 'Filter modules with fewer than 20 questions',
  })
  @IsOptional()
  @IsBoolean()
  fewQuestions?: boolean;
}
