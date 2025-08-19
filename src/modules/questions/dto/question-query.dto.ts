import { InputType, Field, ID } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsEnum, IsBoolean } from 'class-validator';
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
}
