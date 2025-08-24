import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateInstitutionInput } from './create-institution.input';
import { ApiProperty } from '@nestjs/swagger';

@InputType('UpdateUniversityInput')
export class UpdateInstitutionInput extends PartialType(CreateInstitutionInput) {
  @ApiProperty({ description: 'University id' })
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
