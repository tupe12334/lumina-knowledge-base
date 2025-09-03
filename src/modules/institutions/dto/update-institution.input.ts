import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateInstitutionInput } from './create-institution.input';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInstitutionInput extends PartialType(CreateInstitutionInput) {
  @ApiProperty({ description: 'Institution id' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
