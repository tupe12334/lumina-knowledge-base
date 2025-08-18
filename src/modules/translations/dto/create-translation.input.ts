import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTranslationInput {
  @Field(() => String, { description: 'English text' })
  @IsString()
  @IsNotEmpty()
  en_text!: string;

  @Field(() => String, { description: 'Hebrew text' })
  @IsString()
  @IsNotEmpty()
  he_text!: string;
}
