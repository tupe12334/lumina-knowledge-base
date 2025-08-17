import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateDegreeInput {
  @Field(() => String, { description: 'English name of the degree' })
  @IsString()
  @IsNotEmpty()
  en_text: string;

  @Field(() => String, { description: 'Hebrew name of the degree' })
  @IsString()
  @IsNotEmpty()
  he_text: string;

  @Field(() => String, { description: 'ID of the university this degree belongs to' })
  @IsString()
  @IsNotEmpty()
  universityId: string;
}
