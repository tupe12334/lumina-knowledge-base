import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateQuestionInput } from './create-question.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateQuestionInput extends PartialType(CreateQuestionInput) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
