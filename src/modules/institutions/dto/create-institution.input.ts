import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType('CreateUniversityInput')
export class CreateInstitutionInput {
  @ApiProperty({ description: 'English name of the institution' })
  @Field(() => String, { description: 'English name of the institution' })
  @IsString()
  @IsNotEmpty()
  en_text: string;

  @ApiProperty({ description: 'Hebrew name of the institution' })
  @Field(() => String, { description: 'Hebrew name of the institution' })
  @IsString()
  @IsNotEmpty()
  he_text: string;
}
