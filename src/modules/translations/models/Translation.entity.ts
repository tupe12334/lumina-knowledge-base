import { ApiProperty } from '@nestjs/swagger';

export class Translation {
  @ApiProperty()
  en_text!: string;

  @ApiProperty()
  he_text!: string;
}
