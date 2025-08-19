import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUniversityInput } from './create-university.input';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateUniversityInput extends PartialType(CreateUniversityInput) {
  @ApiProperty({ description: 'University id' })
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
