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

@InputType()
export class UpdateSelectAnswerInputItem {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  translationId?: string;
}

@InputType()
export class UpdateAnswerInput {
  @Field()
  @IsUUID()
  id!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  questionId?: string;

  @Field(() => [UpdateSelectAnswerInputItem], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSelectAnswerInputItem)
  selectAnswers?: UpdateSelectAnswerInputItem[];

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: UpdateAnswerInput) => o.numberAnswer == null)
  @IsNumber()
  unitValue?: number;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: UpdateAnswerInput) => o.numberAnswer == null)
  @IsEnum(Units)
  unit?: Units;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: UpdateAnswerInput) => o.unitValue == null && o.unit == null)
  @IsNumber()
  numberAnswer?: number;
}
