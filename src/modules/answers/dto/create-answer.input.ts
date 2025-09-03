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
import { CreateSelectAnswerInputItem } from './create-select-answer-input-item';
import { Units } from '@prisma/client';

export class CreateAnswerInput {
  @ApiProperty({ description: 'Question id', format: 'uuid' })
  @IsUUID()
  questionId!: string;

  @ApiPropertyOptional({ type: [CreateSelectAnswerInputItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSelectAnswerInputItem)
  selectAnswers?: CreateSelectAnswerInputItem[];

  @ApiPropertyOptional({ description: 'Unit value for unit-based answers', example: 9.8 })
  @IsOptional()
  @IsNumber()
  unitValue?: number;

  @ApiPropertyOptional({
    description: 'Unit for unit-based answers',
    enum: Units,
    example: Units.meter
  })
  @IsOptional()
  @IsEnum(Units)
  unit?: Units;

  @ApiPropertyOptional({ description: 'Numeric answer (when not unit based)' })
  @IsOptional()
  @IsNumber()
  numberAnswer?: number;
}
