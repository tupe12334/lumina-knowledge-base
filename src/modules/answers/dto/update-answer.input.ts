import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateSelectAnswerInputItem } from './update-select-answer-input-item';
import { Units } from '@prisma/client';

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

  @ApiPropertyOptional({ description: 'Unit value for unit-based answers', example: 9.8 })
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  unitValue?: number;

  @ApiPropertyOptional({ 
    description: 'Unit for unit-based answers', 
    enum: Units,
    example: Units.meter 
  })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(Units)
  unit?: Units;

  @ApiPropertyOptional({ description: 'Numeric answer (when not unit based)' })
  @Field({ nullable: true })
  @IsOptional()
  @IsOptional()
  @IsNumber()
  numberAnswer?: number;
}
