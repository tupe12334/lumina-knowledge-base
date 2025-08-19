import { InputType, Field, Int, ID } from '@nestjs/graphql';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class ModulesQueryInput {
  @ApiPropertyOptional({ description: 'Filter modules by minimum number of questions' })
  @Field(() => Int, {
    nullable: true,
    description: 'Filter modules by minimum number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minQuestions?: number;

  @ApiPropertyOptional({ description: 'Filter modules by maximum number of questions' })
  @Field(() => Int, {
    nullable: true,
    description: 'Filter modules by maximum number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxQuestions?: number;

  @ApiPropertyOptional({ description: 'Filter modules by exact number of questions' })
  @Field(() => Int, {
    nullable: true,
    description: 'Filter modules by exact number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  exactQuestions?: number;

  @ApiPropertyOptional({ description: 'Filter modules by course ID' })
  @Field(() => ID, {
    nullable: true,
    description: 'Filter modules by course ID',
  })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional({ description: 'Filter modules by university ID' })
  @Field(() => ID, {
    nullable: true,
    description: 'Filter modules by university ID',
  })
  @IsOptional()
  @IsUUID()
  universityId?: string;

  @ApiPropertyOptional({ description: 'Search modules by name (partial match, case insensitive)' })
  @Field(() => String, {
    nullable: true,
    description: 'Search modules by name (partial match, case insensitive)',
  })
  @IsOptional()
  @IsString()
  nameSearch?: string;

  @ApiPropertyOptional({ description: 'Filter modules that have questions' })
  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter modules that have questions',
  })
  @IsOptional()
  @IsBoolean()
  hasQuestions?: boolean;

  @ApiPropertyOptional({ description: 'Filter modules that have prerequisites' })
  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter modules that have prerequisites',
  })
  @IsOptional()
  @IsBoolean()
  hasPrerequisites?: boolean;

  @ApiPropertyOptional({ description: 'Filter modules that have postrequisites' })
  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter modules that have postrequisites',
  })
  @IsOptional()
  @IsBoolean()
  hasPostrequisites?: boolean;

  @ApiPropertyOptional({ description: 'Filter modules that have sub-modules' })
  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter modules that have sub-modules',
  })
  @IsOptional()
  @IsBoolean()
  hasSubModules?: boolean;

  @ApiPropertyOptional({ description: 'Filter modules that have parent modules' })
  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter modules that have parent modules',
  })
  @IsOptional()
  @IsBoolean()
  hasParentModules?: boolean;
}
