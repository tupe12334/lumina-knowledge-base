import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCourseInput } from './create-course.input';

export class CreateManyCoursesInput {
  @ApiProperty({
    description: 'Array of course data to create',
    type: [CreateCourseInput],
    example: [
      { name: 'Computer Science', universityId: 'uuid1' },
      { name: 'Mathematics', universityId: 'uuid2' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one course must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateCourseInput)
  courses!: CreateCourseInput[];
}
