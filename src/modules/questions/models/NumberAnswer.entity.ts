import { ApiProperty } from '@nestjs/swagger';

export class NumberAnswer {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  value!: number;

  @ApiProperty()
  answerId!: string;
}