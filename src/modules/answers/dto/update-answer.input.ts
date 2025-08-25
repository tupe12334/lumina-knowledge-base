import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Units, UnitsValues } from '../../../prisma/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class UpdateSelectAnswerInputItem {
  @ApiPropertyOptional({ description: 'ID of the select answer item' })
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Whether the answer item is correct' })
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @ApiPropertyOptional({ description: 'Translation ID for answer text' })
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  translationId?: string;
}

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

  @ApiPropertyOptional({ description: 'Unit value for unit-based answers' })
  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: UpdateAnswerInput) => o.numberAnswer == null)
  @IsNumber()
  unitValue?: number;

  @ApiPropertyOptional({ enum: UnitsValues })
  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: UpdateAnswerInput) => o.numberAnswer == null)
  @IsEnum(UnitsValues)
  unit?: Units;

  @ApiPropertyOptional({ description: 'Numeric answer (when not unit based)' })
  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: UpdateAnswerInput) => o.unitValue == null && o.unit == null)
  @IsNumber()
  numberAnswer?: number;
}
