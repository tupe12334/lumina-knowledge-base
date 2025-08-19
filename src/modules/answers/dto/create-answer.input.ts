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
import { Units } from '../../../prisma/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class CreateSelectAnswerInputItem {
  @ApiProperty({ description: 'Whether the answer item is correct' })
  @Field()
  @IsBoolean()
  isCorrect!: boolean;

  @ApiProperty({
    description: 'Translation id for answer text',
    format: 'uuid',
  })
  @Field()
  @IsUUID()
  translationId!: string;
}

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

  @ApiPropertyOptional({ description: 'Unit value for unit-based answers' })
  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: CreateAnswerInput) => o.numberAnswer == null)
  @IsNumber()
  unitValue?: number;

  @ApiPropertyOptional({ enum: Units })
  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: CreateAnswerInput) => o.numberAnswer == null)
  @IsEnum(Units)
  unit?: Units;

  @ApiPropertyOptional({ description: 'Numeric answer (when not unit based)' })
  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: CreateAnswerInput) => o.unitValue == null && o.unit == null)
  @IsNumber()
  numberAnswer?: number;
}
