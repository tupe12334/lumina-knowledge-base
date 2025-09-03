import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAnswerInput } from './create-answer.input';

export class CreateManyAnswersInput {
  @ApiProperty({
    description: 'Array of answer data to create',
    type: [CreateAnswerInput],
    example: [
      { questionId: 'uuid1', answerType: 'selection' },
      { questionId: 'uuid2', answerType: 'unit' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one answer must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerInput)
  answers!: CreateAnswerInput[];
}
