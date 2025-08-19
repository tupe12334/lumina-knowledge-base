import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class DeleteQuestionInput {
  @ApiProperty({ description: 'ID of the question to delete' })
  @Field(() => String)
  @IsUUID()
  id: string;
}
