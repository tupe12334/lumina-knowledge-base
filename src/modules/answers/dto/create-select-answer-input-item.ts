import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateSelectAnswerInputItem {
  @ApiProperty({ description: 'Whether the answer item is correct' })
  @Field()
  @IsBoolean()
  isCorrect!: boolean;

  @ApiProperty({
    description: 'Translation id for answer text',
    format: 'uuid',
  })
  @Field()
  @IsUUID()
  translationId!: string;
}