import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateFacultyInput } from './create-faculty.input';

@InputType()
export class UpdateFacultyInput extends PartialType(CreateFacultyInput) {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
