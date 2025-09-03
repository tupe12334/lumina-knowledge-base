import { ApiProperty } from '@nestjs/swagger';

export class Translation {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  en_text!: string;

  @ApiProperty()
  he_text!: string;
}
