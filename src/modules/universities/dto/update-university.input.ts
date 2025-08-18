import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUniversityInput } from './create-university.input';

@InputType()
export class UpdateUniversityInput extends PartialType(CreateUniversityInput) {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
