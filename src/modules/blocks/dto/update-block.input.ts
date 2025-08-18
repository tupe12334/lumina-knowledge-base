import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBlockInput } from './create-block.input';

@InputType()
export class UpdateBlockInput extends PartialType(CreateBlockInput) {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
