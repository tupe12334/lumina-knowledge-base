import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateFacultyInput {
  @ApiProperty({ description: 'Name of the faculty' })
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the faculty' })
  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'ID of the university this faculty belongs to' })
  @Field()
  @IsUUID()
  universityId: string;
}
