import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDegreeInput } from './create-degree.input';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateDegreeInput extends PartialType(CreateDegreeInput) {
  @ApiProperty({ description: 'Degree id' })
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
