import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDegreeInput } from './create-degree.input';

@InputType()
export class UpdateDegreeInput extends PartialType(CreateDegreeInput) {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
