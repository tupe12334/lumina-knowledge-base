import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateQuestionInput } from './create-question.input';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateQuestionInput extends PartialType(CreateQuestionInput) {
  @ApiProperty({ description: 'ID of the question to update' })
  @Field(() => String)
  @IsUUID()
  id: string;
}
