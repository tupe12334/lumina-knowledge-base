import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateFacultyInput } from './create-faculty.input';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFacultyInput extends PartialType(CreateFacultyInput) {
  @ApiProperty({ description: 'Faculty ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
