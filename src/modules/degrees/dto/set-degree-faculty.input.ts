import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

type OptionalString = string | null;

/**
 * Input for setting or clearing a degree's faculty.
 */
export class SetDegreeFacultyInput {
  @ApiProperty({ description: 'Degree ID' })
  @IsUUID()
  degreeId!: string;

  @ApiPropertyOptional({ description: 'Faculty ID to assign; null to clear' })
  @IsOptional()
  @IsUUID()
  facultyId?: OptionalString;
}
