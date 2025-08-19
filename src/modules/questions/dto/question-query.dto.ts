import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { QuestionType, QuestionValidationStatus } from '@prisma/client';

@InputType()
export class QuestionsQueryDto {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  id?: string;

  @Field(() => QuestionType, { nullable: true })
  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @Field(() => QuestionValidationStatus, { nullable: true })
  @IsEnum(QuestionValidationStatus)
  @IsOptional()
  validationStatus?: QuestionValidationStatus;

  @Field(() => ID, { nullable: true, description: 'Filter by module ID' })
  @IsUUID()
  @IsOptional()
  moduleId?: string;

  @Field(() => [ID], {
    nullable: true,
    description: 'Filter by multiple module IDs',
  })
  @IsUUID('4', { each: true })
  @IsOptional()
  moduleIds?: string[];

  @Field(() => Boolean, {
    nullable: true,
    defaultValue: true,
    description: 'Include submodules when filtering by module ID',
  })
  @IsBoolean()
  @IsOptional()
  includeSubmodules?: boolean;

  @Field(() => ID, { nullable: true, description: 'Filter by course ID' })
  @IsUUID()
  @IsOptional()
  courseId?: string;

  @Field(() => [ID], {
    nullable: true,
    description: 'Filter by multiple course IDs',
  })
  @IsUUID('4', { each: true })
  @IsOptional()
  courseIds?: string[];

  @Field(() => QuestionType, {
    nullable: true,
    description: 'Filter by question type',
  })
  @IsEnum(QuestionType)
  @IsOptional()
  questionType?: QuestionType;

  @Field(() => [QuestionType], {
    nullable: true,
    description: 'Filter by multiple question types',
  })
  @IsEnum(QuestionType, { each: true })
  @IsOptional()
  questionTypes?: QuestionType[];
}
