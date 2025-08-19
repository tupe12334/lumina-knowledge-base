import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { QuestionType, QuestionValidationStatus } from '@prisma/client';

@InputType()
export class CreateQuestionInput {
  @Field(() => QuestionValidationStatus, {
    defaultValue: QuestionValidationStatus.ai_generated,
  })
  @IsEnum(QuestionValidationStatus)
  @IsOptional()
  validationStatus?: QuestionValidationStatus;

  @Field(() => String, {
    description: 'The ID of the translation for the question text',
  })
  @IsUUID()
  translationId: string;

  @Field(() => QuestionType, { description: 'The type of the question' })
  @IsEnum(QuestionType)
  type: QuestionType;

  @Field(() => [String], {
    nullable: true,
    description: 'Optional list of module IDs this question belongs to',
  })
  @IsUUID('4', { each: true })
  @IsOptional()
  moduleIds?: string[];
}
