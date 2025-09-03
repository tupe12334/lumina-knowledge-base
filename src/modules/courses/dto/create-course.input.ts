import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseInput {
  @ApiProperty({ description: 'Course name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Owning institution id', format: 'uuid' })
  @IsUUID()
  universityId: string;
}
