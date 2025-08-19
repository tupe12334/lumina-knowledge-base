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
export class CreateSelectAnswerInputItem {
  @Field()
  @IsBoolean()
  isCorrect!: boolean;

  @Field()
  @IsUUID()
  translationId!: string;
}

@InputType()
export class CreateAnswerInput {
  @Field()
  @IsUUID()
  questionId!: string;

  @Field(() => [CreateSelectAnswerInputItem], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSelectAnswerInputItem)
  selectAnswers?: CreateSelectAnswerInputItem[];

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: CreateAnswerInput) => o.numberAnswer == null)
  @IsNumber()
  unitValue?: number;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: CreateAnswerInput) => o.numberAnswer == null)
  @IsEnum(Units)
  unit?: Units;

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((o: CreateAnswerInput) => o.unitValue == null && o.unit == null)
  @IsNumber()
  numberAnswer?: number;
}
