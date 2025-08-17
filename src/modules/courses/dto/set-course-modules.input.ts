import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsArray } from 'class-validator';

@InputType()
export class SetCourseModulesInput {
  @Field(() => ID, { description: 'Course ID' })
  @IsUUID()
  courseId!: string;

  @Field(() => [ID], {
    description:
      'List of module IDs to assign to the course (replaces existing)',
  })
  @IsArray()
  moduleIds!: string[];
}
