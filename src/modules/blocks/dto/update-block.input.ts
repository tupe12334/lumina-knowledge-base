import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBlockInput } from './create-block.input';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateBlockInput extends PartialType(CreateBlockInput) {
  @ApiProperty({ description: 'Block ID' })
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
