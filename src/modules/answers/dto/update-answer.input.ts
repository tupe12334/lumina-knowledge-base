import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateSelectAnswerInputItem } from './update-select-answer-input-item';

@InputType()
export class UpdateAnswerInput {
  @ApiProperty({ description: 'Answer ID' })
  @Field()
  @IsUUID()
  id!: string;

  @ApiPropertyOptional({ description: 'Question ID' })
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  questionId?: string;

  @ApiPropertyOptional({ type: [UpdateSelectAnswerInputItem] })
  @Field(() => [UpdateSelectAnswerInputItem], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSelectAnswerInputItem)
  selectAnswers?: UpdateSelectAnswerInputItem[];

  // Unit value field removed as it was unused

  // Unit field removed as it was unused

  @ApiPropertyOptional({ description: 'Numeric answer (when not unit based)' })
  @Field({ nullable: true })
  @IsOptional()
  @IsOptional()
  @IsNumber()
  numberAnswer?: number;
}
