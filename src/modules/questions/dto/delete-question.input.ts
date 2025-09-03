import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class DeleteQuestionInput {
  @ApiProperty({ description: 'ID of the question to delete' })
  @IsUUID()
  id: string;
}
