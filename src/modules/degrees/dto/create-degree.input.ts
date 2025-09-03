import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDegreeInput {
  @ApiProperty({ description: 'Degree name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Owning institution id', format: 'uuid' })
  @IsUUID()
  universityId: string;
}
