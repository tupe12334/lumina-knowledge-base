import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddCourseDto {
  @ApiProperty({ description: 'ID of the course to add' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}