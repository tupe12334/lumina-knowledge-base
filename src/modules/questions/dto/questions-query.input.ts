import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, IsBoolean, IsIn, IsArray } from 'class-validator';

enum QuestionTypeEnum {
  SELECTION = 'selection',
  VALUE = 'value',
  VOID = 'void',
}

registerEnumType(QuestionTypeEnum, {
  name: 'QuestionType',
  description: 'The type of question',
});

@InputType()
export class QuestionsQueryInput {
  @Field(() => [String], { nullable: true, description: 'Filter questions by module IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  moduleIds?: string[];

  @Field(() => [String], { nullable: true, description: 'Filter questions by course IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  courseIds?: string[];

  @Field(() => [QuestionTypeEnum], {
    nullable: true,
    description: 'Filter questions by question types',
  })
  @IsOptional()
  @IsArray()
  @IsIn(['selection', 'value', 'void'], { each: true })
  questionTypes?: QuestionTypeEnum[];

  @Field({
    nullable: true,
    description: 'Exclude questions that are part of other questions',
  })
  @IsOptional()
  @IsBoolean()
  excludePartQuestions?: boolean;

  // Keep the old single-value fields for backward compatibility
  @Field({ nullable: true, description: 'Filter questions by module ID (deprecated, use moduleIds)' })
  @IsOptional()
  @IsString()
  @IsUUID()
  moduleId?: string;

  @Field({ nullable: true, description: 'Filter questions by course ID (deprecated, use courseIds)' })
  @IsOptional()
  @IsString()
  @IsUUID()
  courseId?: string;

  @Field(() => QuestionTypeEnum, {
    nullable: true,
    description: 'Filter questions by question type (deprecated, use questionTypes)',
  })
  @IsOptional()
  @IsIn(['selection', 'value', 'void'])
  questionType?: QuestionTypeEnum;
}
