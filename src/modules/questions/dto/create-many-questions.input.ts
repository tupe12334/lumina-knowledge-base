import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateQuestionInput } from './create-question.input';
export class CreateManyQuestionsInput {
  @ApiProperty({
    description: 'Array of question data to create',
    type: [CreateQuestionInput],
    example: [
      { type: 'selection', translationId: 'uuid1', moduleIds: ['uuid1'] },
      { type: 'value', translationId: 'uuid2', moduleIds: ['uuid2'] },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one question must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionInput)
  questions!: CreateQuestionInput[];
}
