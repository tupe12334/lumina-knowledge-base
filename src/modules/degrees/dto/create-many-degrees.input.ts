import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDegreeInput } from './create-degree.input';

@InputType()
export class CreateManyDegreesInput {
  @ApiProperty({
    description: 'Array of degree data to create',
    type: [CreateDegreeInput],
    example: [
      { name: 'Bachelor of Science', universityId: 'uuid1' },
      { name: 'Master of Arts', universityId: 'uuid2' },
    ],
  })
  @Field(() => [CreateDegreeInput], {
    description: 'Array of degree data to create',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one degree must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateDegreeInput)
  degrees!: CreateDegreeInput[];
}
