import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class AddCourseToDegreeInput {
  @ApiProperty({ description: 'ID of the course to add' })
  @Field(() => String, { description: 'ID of the course to add' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ description: 'ID of the degree to add the course to' })
  @Field(() => String, { description: 'ID of the degree to add the course to' })
  @IsString()
  @IsNotEmpty()
  degreeId: string;
}
