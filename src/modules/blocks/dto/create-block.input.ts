import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateBlockInput {
  @ApiProperty({ description: 'Name of the block' })
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID of the module this block belongs to' })
  @Field()
  @IsUUID()
  moduleId: string;
}
