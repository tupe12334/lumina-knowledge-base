import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateTranslationInput {
  @ApiProperty({ description: 'English text' })
  @Field(() => String, { description: 'English text' })
  @IsString()
  @IsNotEmpty()
  en_text!: string;

  @ApiProperty({ description: 'Hebrew text' })
  @Field(() => String, { description: 'Hebrew text' })
  @IsString()
  @IsNotEmpty()
  he_text!: string;
}
