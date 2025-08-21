import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateFacultyInput } from './create-faculty.input';

@InputType()
export class CreateManyFacultiesInput {
  @ApiProperty({
    description: 'Array of faculty data to create',
    type: [CreateFacultyInput],
    example: [
      {
        name: 'Computer Science',
        description: 'CS Department',
        universityId: 'uuid1',
      },
      {
        name: 'Mathematics',
        description: 'Math Department',
        universityId: 'uuid2',
      },
    ],
  })
  @Field(() => [CreateFacultyInput], {
    description: 'Array of faculty data to create',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one faculty must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateFacultyInput)
  faculties!: CreateFacultyInput[];
}
