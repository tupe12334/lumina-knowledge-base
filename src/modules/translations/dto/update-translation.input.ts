import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateTranslationInput } from './create-translation.input';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class UpdateTranslationInput extends PartialType(
  CreateTranslationInput,
) {
  @Field(() => ID, { description: 'Translation ID' })
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}
