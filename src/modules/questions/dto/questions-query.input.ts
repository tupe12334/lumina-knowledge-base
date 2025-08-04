import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsIn,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { QuestionType } from '../models/question-type.enum';

registerEnumType(QuestionType, {
  name: 'QuestionType',
  description: 'The type of question',
});

@InputType()
export class QuestionsQueryInput {
  @Field(() => [String], {
    nullable: true,
    description: 'Filter questions by module IDs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  moduleIds?: string[];

  @Field(() => [String], {
    nullable: true,
    description: 'Filter questions by course IDs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  courseIds?: string[];

  @Field(() => [QuestionType], {
    nullable: true,
    description: 'Filter questions by question types',
  })
  @IsOptional()
  @IsArray()
  @IsIn(['selection', 'value', 'void'], { each: true })
  questionTypes?: QuestionType[];

  @Field(() => Boolean, {
    nullable: true,
    description:
      'Whether to include questions from submodules when filtering by module (default: true)',
    defaultValue: true,
  })
  @IsOptional()
  @IsBoolean()
  includeSubmodules?: boolean;

  // Keep the old single-value fields for backward compatibility
  @Field({
    nullable: true,
    description: 'Filter questions by module ID (deprecated, use moduleIds)',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  moduleId?: string;

  @Field({
    nullable: true,
    description: 'Filter questions by course ID (deprecated, use courseIds)',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  courseId?: string;

  @Field(() => QuestionType, {
    nullable: true,
    description:
      'Filter questions by question type (deprecated, use questionTypes)',
  })
  @IsOptional()
  @IsIn(['selection', 'value', 'void'])
  questionType?: QuestionType;
}
