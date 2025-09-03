import { CreateTranslationInput } from './create-translation.input';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
export class UpdateTranslationInput extends PartialType(
  CreateTranslationInput,
) {
  @ApiProperty({ description: 'Translation ID' })
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}
