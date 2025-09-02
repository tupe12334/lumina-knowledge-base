import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class UpdateSelectAnswerInputItem {
  @ApiPropertyOptional({ description: 'ID of the select answer item' })
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Whether the answer item is correct' })
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @ApiPropertyOptional({ description: 'Translation ID for answer text' })
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  translationId?: string;
}