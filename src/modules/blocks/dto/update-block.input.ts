import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBlockInput } from './create-block.input';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlockInput extends PartialType(CreateBlockInput) {
  @ApiProperty({ description: 'Block ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
