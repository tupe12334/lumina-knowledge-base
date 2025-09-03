import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockInput {
  @ApiProperty({ description: 'Name of the block' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID of the module this block belongs to' })
  @IsUUID()
  moduleId: string;
}
