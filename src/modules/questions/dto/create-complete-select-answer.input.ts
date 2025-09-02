import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateCompleteSelectAnswerInput {
  @ApiProperty({
    description: 'English text for the answer option',
    example: 'The derivative of a function',
  })
  @IsString()
  @IsNotEmpty()
  en_text: string;

  @ApiProperty({
    description: 'Hebrew text for the answer option',
    example: 'הנגזרת של פונקציה',
  })
  @IsString()
  @IsNotEmpty()
  he_text: string;

  @ApiProperty({
    description: 'Whether this answer option is correct',
    example: true,
  })
  @IsBoolean()
  is_correct: boolean;
}