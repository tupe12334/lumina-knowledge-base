import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateModuleInput {
  @Field(() => String, { description: 'English name of the module' })
  @IsString()
  @IsNotEmpty()
  en_text: string;

  @Field(() => String, { description: 'Hebrew name of the module' })
  @IsString()
  @IsNotEmpty()
  he_text: string;

  @Field(() => String, {
    description: 'ID of the course this module belongs to',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
