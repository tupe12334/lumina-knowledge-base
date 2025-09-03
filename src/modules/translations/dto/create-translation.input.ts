import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTranslationInput {
  @ApiProperty({ description: 'English text' })
  @IsString()
  @IsNotEmpty()
  en_text!: string;

  @ApiProperty({ description: 'Hebrew text' })
  @IsString()
  @IsNotEmpty()
  he_text!: string;
}
