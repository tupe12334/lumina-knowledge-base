import { InputType, Field, ID } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class UpdateCourseInput {
  @ApiProperty({ description: 'Course ID' })
  @Field(() => ID, { description: 'Course ID' })
  courseId!: string;

  // Translation updates (optional)
  @ApiPropertyOptional({ description: 'English name text' })
  @Field(() => String, { nullable: true, description: 'English name text' })
  enText?: string | null;

  @ApiPropertyOptional({ description: 'Hebrew name text' })
  @Field(() => String, { nullable: true, description: 'Hebrew name text' })
  heText?: string | null;

  // Additional optional course fields (extend safely later as needed)
  @ApiPropertyOptional({ description: 'University ID of the course' })
  @Field(() => String, {
    nullable: true,
    description: 'University ID of the course',
  })
  universityId?: string | null;

  @ApiPropertyOptional({ description: 'Published at timestamp (UTC)' })
  @Field(() => Date, {
    nullable: true,
    description: 'Published at timestamp (UTC)',
  })
  publishedAt?: Date | null;
}
