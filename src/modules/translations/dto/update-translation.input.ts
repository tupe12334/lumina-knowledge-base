import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateTranslationInput } from './create-translation.input';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateTranslationInput extends PartialType(
  CreateTranslationInput,
) {
  @ApiProperty({ description: 'Translation ID' })
  @Field(() => ID, { description: 'Translation ID' })
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}
