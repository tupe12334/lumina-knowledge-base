import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUniversityInput {
  @Field(() => String, { description: 'English name of the university' })
  @IsString()
  @IsNotEmpty()
  en_text: string;

  @Field(() => String, { description: 'Hebrew name of the university' })
  @IsString()
  @IsNotEmpty()
  he_text: string;
}
