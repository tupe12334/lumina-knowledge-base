import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateUniversityInput {
  @ApiProperty({ description: 'English name of the university' })
  @Field(() => String, { description: 'English name of the university' })
  @IsString()
  @IsNotEmpty()
  en_text: string;

  @ApiProperty({ description: 'Hebrew name of the university' })
  @Field(() => String, { description: 'Hebrew name of the university' })
  @IsString()
  @IsNotEmpty()
  he_text: string;
}
