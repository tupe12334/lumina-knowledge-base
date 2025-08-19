import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsArray }mport { ApiProperty } from '@nestjs/swagger';

@InputType()
export class SetCourseModulesInput {
  @ApiProperty({ description: 'Course ID' })
  @Field(() => ID, { description: 'Course ID' })
  @IsUUID()
  courseId!: string;

  @ApiProperty({ description: 'List of module IDs to assign to the course (replaces existing)' })
  @Field(() => [ID], {
    description:
      'List of module IDs to assign to the course (replaces existing)',
  })
  @IsArray()
  moduleIds!: string[];
}
