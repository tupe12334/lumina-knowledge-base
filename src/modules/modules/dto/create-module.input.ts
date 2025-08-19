import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateModuleInput {
  @ApiProperty({ description: 'English name of the module' })
  @Field(() => String, { description: 'English name of the module' })
  @IsString()
  @IsNotEmpty()
  en_text: string;

  @ApiProperty({ description: 'Hebrew name of the module' })
  @Field(() => String, { description: 'Hebrew name of the module' })
  @IsString()
  @IsNotEmpty()
  he_text: string;

  @ApiProperty({ description: 'ID of the course this module belongs to' })
  @Field(() => String, {
    description: 'ID of the course this module belongs to',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
