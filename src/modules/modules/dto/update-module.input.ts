import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateModuleInput } from './create-module.input';

@InputType()
export class UpdateModuleInput extends PartialType(CreateModuleInput) {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
