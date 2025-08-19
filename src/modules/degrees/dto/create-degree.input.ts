import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateDegreeInput {
  @ApiProperty({ description: 'Degree name' })
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Owning university id', format: 'uuid' })
  @Field()
  @IsUUID()
  universityId: string;
}
