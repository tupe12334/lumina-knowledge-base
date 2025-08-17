import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteQuestionInput {
  @Field(() => String)
  @IsUUID()
  id: string;
}
