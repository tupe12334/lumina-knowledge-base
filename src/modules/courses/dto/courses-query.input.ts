import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CoursesQueryInput {
  @ApiPropertyOptional({
    description: 'Filter courses by university ID',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  universityId?: string;

  @ApiPropertyOptional({
    description: 'Filter courses by degree ID',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  degreeId?: string;

  @ApiPropertyOptional({
    description: 'Sort courses to prioritize degree courses first',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return false;
  })
  sortByDegree?: boolean = false;
}