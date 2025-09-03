import { IsNotEmpty, IsString } from 'class-validator';
import { CreateModuleInput } from './create-module.input';
import { ApiProperty, PartialType } from '@nestjs/swagger';
export class UpdateModuleInput extends PartialType(CreateModuleInput) {
  @ApiProperty({ description: 'Module ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
