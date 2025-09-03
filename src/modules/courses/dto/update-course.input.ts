import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

type OptionalString = string | null;
type OptionalDate = Date | null;

export class UpdateCourseInput {
  @ApiProperty({ description: 'Course ID' })
  courseId!: string;

  // Translation updates (optional)
  @ApiPropertyOptional({ description: 'English name text' })
  enText?: OptionalString;

  @ApiPropertyOptional({ description: 'Hebrew name text' })
  heText?: OptionalString;

  // Additional optional course fields (extend safely later as needed)
  @ApiPropertyOptional({ description: 'Institution ID of the course' })
  universityId?: OptionalString;

  @ApiPropertyOptional({ description: 'Published at timestamp (UTC)' })
  publishedAt?: OptionalDate;
}
