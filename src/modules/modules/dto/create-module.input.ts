import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleInput {
  @ApiProperty({ description: 'English name of the module' })
  @IsString()
  @IsNotEmpty()
  en_text: string;

  @ApiProperty({ description: 'Hebrew name of the module' })
  @IsString()
  @IsNotEmpty()
  he_text: string;

  @ApiProperty({ description: 'ID of the course this module belongs to' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
