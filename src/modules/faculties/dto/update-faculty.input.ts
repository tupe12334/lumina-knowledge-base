import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateFacultyInput } from './create-faculty.input';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateFacultyInput extends PartialType(CreateFacultyInput) {
  @ApiProperty({ description: 'Faculty ID' })
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
