import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsEnum, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { QuestionType, QuestionValidationStatus } from '@prisma/client';

@InputType()
export class QuestionsQueryDto {
  @ApiPropertyOptional()
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ enum: QuestionType, enumName: 'QuestionType' })
  @Field(() => QuestionType, { nullable: true })
  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @ApiPropertyOptional({
    enum: QuestionValidationStatus,
    enumName: 'QuestionValidationStatus',
  })
  @Field(() => QuestionValidationStatus, { nullable: true })
  @IsEnum(QuestionValidationStatus)
  @IsOptional()
  validationStatus?: QuestionValidationStatus;

  @ApiPropertyOptional()
  @Field(() => ID, { nullable: true, description: 'Filter by module ID' })
  @IsUUID()
  @IsOptional()
  moduleId?: string;

  @ApiPropertyOptional()
  @Field(() => [ID], {
    nullable: true,
    description: 'Filter by multiple module IDs',
  })
  @IsUUID('4', { each: true })
  @IsOptional()
  moduleIds?: string[];

  @ApiPropertyOptional()
  @Field(() => Boolean, {
    nullable: true,
    defaultValue: true,
    description: 'Include submodules when filtering by module ID',
  })
  @IsBoolean()
  @IsOptional()
  includeSubmodules?: boolean;

  @ApiPropertyOptional()
  @Field(() => ID, { nullable: true, description: 'Filter by course ID' })
  @IsUUID()
  @IsOptional()
  courseId?: string;

  @ApiPropertyOptional()
  @Field(() => [ID], {
    nullable: true,
    description: 'Filter by multiple course IDs',
  })
  @IsUUID('4', { each: true })
  @IsOptional()
  courseIds?: string[];

  @ApiPropertyOptional({ enum: QuestionType, enumName: 'QuestionType' })
  @Field(() => QuestionType, {
    nullable: true,
    description: 'Filter by question type',
  })
  @IsEnum(QuestionType)
  @IsOptional()
  questionType?: QuestionType;

  @ApiPropertyOptional({ enum: QuestionType, enumName: 'QuestionType' })
  @Field(() => [QuestionType], {
    nullable: true,
    description: 'Filter by multiple question types',
  })
  @IsEnum(QuestionType, { each: true })
  @IsOptional()
  questionTypes?: QuestionType[];

  // Pagination fields
  @ApiPropertyOptional({ minimum: 0, default: 0 })
  @Field(() => Int, {
    nullable: true,
    defaultValue: 0,
    description: 'Number of records to skip for pagination',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @Field(() => Int, {
    nullable: true,
    defaultValue: 20,
    description: 'Number of records to return (max 100)',
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  // Additional fields for advanced filtering
  @ApiPropertyOptional()
  @Field(() => [ID], {
    nullable: true,
    description: 'Filter by specific question IDs',
  })
  @IsUUID('4', { each: true })
  @IsOptional()
  ids?: string[];

  @ApiPropertyOptional()
  @Field(() => String, {
    nullable: true,
    description: 'Search in question text',
  })
  @IsOptional()
  textSearch?: string;

  @ApiPropertyOptional()
  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter questions that have parts',
  })
  @IsBoolean()
  @IsOptional()
  hasParts?: boolean;
}
