import { InputType, Field, Int, ID } from '@nestjs/graphql';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsBoolean,
  IsUUID,
} from 'class-validator';

@InputType()
export class ModulesQueryInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Filter modules by minimum number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minQuestions?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Filter modules by maximum number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxQuestions?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Filter modules by exact number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  exactQuestions?: number;

  @Field(() => ID, {
    nullable: true,
    description: 'Filter modules by course ID',
  })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @Field(() => ID, {
    nullable: true,
    description: 'Filter modules by university ID',
  })
  @IsOptional()
  @IsUUID()
  universityId?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Search modules by name (partial match, case insensitive)',
  })
  @IsOptional()
  @IsString()
  nameSearch?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter modules that have questions',
  })
  @IsOptional()
  @IsBoolean()
  hasQuestions?: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter modules that have prerequisites',
  })
  @IsOptional()
  @IsBoolean()
  hasPrerequisites?: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter modules that have postrequisites',
  })
  @IsOptional()
  @IsBoolean()
  hasPostrequisites?: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter modules that have sub-modules',
  })
  @IsOptional()
  @IsBoolean()
  hasSubModules?: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter modules that have parent modules',
  })
  @IsOptional()
  @IsBoolean()
  hasParentModules?: boolean;
}
