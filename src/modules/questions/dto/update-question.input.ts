import { CreateQuestionInput } from './create-question.input';
import { IsUUID } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
export class UpdateQuestionInput extends PartialType(CreateQuestionInput) {
  @ApiProperty({ description: 'ID of the question to update' })
  @IsUUID()
  id: string;
}
