import { ApiProperty } from '@nestjs/swagger';

export class UnitAnswer {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  value!: number;

  @ApiProperty()
  unit!: string;

  @ApiProperty()
  answerId!: string;
}