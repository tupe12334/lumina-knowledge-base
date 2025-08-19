import { InputType, Field } from '@nestjs/graphql';
import { IsUUID }mport { ApiProperty } from '@nestjs/swagger';

@InputType()
export class DeleteQuestionInput {
  @ApiProperty({ description: 'ID of the question to delete' })
  @Field(() => String)
  @IsUUID()
  id: string;
}
