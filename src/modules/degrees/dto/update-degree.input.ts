import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDegreeInput } from './create-degree.input';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDegreeInput extends PartialType(CreateDegreeInput) {
  @ApiProperty({ description: 'Degree id' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
