import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateModuleInput } from './create-module.input';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateModuleInput extends PartialType(CreateModuleInput) {
  @ApiProperty({ description: 'Module ID' })
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
