import { ApiProperty } from '@nestjs/swagger';
import { QuestionPart as PrismaQuestionPart } from '@prisma/client';

export class QuestionPart implements PrismaQuestionPart {
  @ApiProperty()
  id: string;

  @ApiProperty()
  questionId: string;

  @ApiProperty()
  partQuestionId: string;

  @ApiProperty()
  order: number;
}
