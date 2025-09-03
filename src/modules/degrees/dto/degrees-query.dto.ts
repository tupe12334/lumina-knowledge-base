import { ApiPropertyOptional } from '@nestjs/swagger';
export class DegreesQueryDto {
  @ApiPropertyOptional({ description: 'Filter by name' })
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by faculty id' })
  facultyId?: string;

  @ApiPropertyOptional({ description: 'Filter by institution id' })
  universityId?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum course count' })
  minCourseCount?: number;
}
