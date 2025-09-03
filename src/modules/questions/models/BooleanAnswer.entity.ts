import { ApiProperty } from '@nestjs/swagger';

export class BooleanAnswer {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  value!: boolean;

  @ApiProperty()
  answerId!: string;
}