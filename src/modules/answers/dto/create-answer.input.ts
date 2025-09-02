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
import { CreateSelectAnswerInputItem } from './create-select-answer-input-item';

@InputType()
export class CreateAnswerInput {
  @ApiProperty({ description: 'Question id', format: 'uuid' })
  @Field()
  @IsUUID()
  questionId!: string;

  @ApiPropertyOptional({ type: [CreateSelectAnswerInputItem] })
  @Field(() => [CreateSelectAnswerInputItem], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSelectAnswerInputItem)
  selectAnswers?: CreateSelectAnswerInputItem[];

  // Unit value field removed as it was unused

  // Unit field removed as it was unused

  @ApiPropertyOptional({ description: 'Numeric answer (when not unit based)' })
  @Field({ nullable: true })
  @IsOptional()
  @IsOptional()
  @IsNumber()
  numberAnswer?: number;
}
