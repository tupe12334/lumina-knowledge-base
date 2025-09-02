import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCompleteQuestionInput } from './create-complete-question.input';

export class CreateCompleteQuestionsInput {
  @ApiProperty({
    description: 'Array of complete questions to create',
    type: [CreateCompleteQuestionInput],
    example: [
      {
        en_text: 'What is calculus?',
        he_text: 'מה זה חשבון אינפיניטסימלי?',
        type: 'selection',
        moduleIds: ['uuid-1'],
        selectAnswers: [
          {
            en_text: 'A branch of mathematics',
            he_text: 'ענף במתמטיקה',
            is_correct: true,
          },
          {
            en_text: 'A type of calculator',
            he_text: 'סוג של מחשבון',
            is_correct: false,
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompleteQuestionInput)
  questions: CreateCompleteQuestionInput[];
}
