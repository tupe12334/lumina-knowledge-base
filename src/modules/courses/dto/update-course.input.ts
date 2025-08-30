import { InputType, Field, ID } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

type OptionalString = string | null;
type OptionalDate = Date | null;

@InputType()
export class UpdateCourseInput {
  @ApiProperty({ description: 'Course ID' })
  @Field(() => ID, { description: 'Course ID' })
  courseId!: string;

  // Translation updates (optional)
  @ApiPropertyOptional({ description: 'English name text' })
  @Field(() => String, { nullable: true, description: 'English name text' })
  enText?: OptionalString;

  @ApiPropertyOptional({ description: 'Hebrew name text' })
  @Field(() => String, { nullable: true, description: 'Hebrew name text' })
  heText?: OptionalString;

  // Additional optional course fields (extend safely later as needed)
  @ApiPropertyOptional({ description: 'Institution ID of the course' })
  @Field(() => String, {
    nullable: true,
    description: 'Institution ID of the course',
  })
  universityId?: OptionalString;

  @ApiPropertyOptional({ description: 'Published at timestamp (UTC)' })
  @Field(() => Date, {
    nullable: true,
    description: 'Published at timestamp (UTC)',
  })
  publishedAt?: OptionalDate;
}
