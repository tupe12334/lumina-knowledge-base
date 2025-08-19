import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { QuestionType, QuestionValidationStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class CreateQuestionInput {
  @ApiPropertyOptional({
    enum: QuestionValidationStatus,
    description: 'The validation status of the question',
  })
  @Field(() => QuestionValidationStatus, {
    defaultValue: QuestionValidationStatus.ai_generated,
  })
  @IsEnum(QuestionValidationStatus)
  @IsOptional()
  validationStatus?: QuestionValidationStatus;

  @ApiProperty({
    description: 'The ID of the translation for the question text',
  })
  @Field(() => String, {
    description: 'The ID of the translation for the question text',
  })
  @IsUUID()
  translationId: string;

  @ApiProperty({ enum: QuestionType, description: 'The type of the question' })
  @Field(() => QuestionType, { description: 'The type of the question' })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiPropertyOptional({
    type: [String],
    description: 'Optional list of module IDs this question belongs to',
  })
  @Field(() => [String], {
    nullable: true,
    description: 'Optional list of module IDs this question belongs to',
  })
  @IsUUID('4', { each: true })
  @IsOptional()
  moduleIds?: string[];
}
