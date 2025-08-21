import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTranslationInput } from './create-translation.input';

@InputType()
export class CreateManyTranslationsInput {
  @ApiProperty({
    description: 'Array of translation data to create',
    type: [CreateTranslationInput],
    example: [
      { en_text: 'Hello', he_text: 'שלום' },
      { en_text: 'Goodbye', he_text: 'להתראות' },
    ],
  })
  @Field(() => [CreateTranslationInput], {
    description: 'Array of translation data to create',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one translation must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateTranslationInput)
  translations!: CreateTranslationInput[];
}
