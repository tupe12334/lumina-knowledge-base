import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCourseInput {
  @Field(() => ID, { description: 'Course ID' })
  courseId!: string;

  // Translation updates (optional)
  @Field(() => String, { nullable: true, description: 'English name text' })
  enText?: string | null;

  @Field(() => String, { nullable: true, description: 'Hebrew name text' })
  heText?: string | null;

  // Additional optional course fields (extend safely later as needed)
  @Field(() => String, {
    nullable: true,
    description: 'University ID of the course',
  })
  universityId?: string | null;

  @Field(() => Date, {
    nullable: true,
    description: 'Published at timestamp (UTC)',
  })
  publishedAt?: Date | null;
}
