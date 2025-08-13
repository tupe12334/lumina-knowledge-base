import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModuleRelationshipDto {
  @ApiProperty({
    description: 'ID of the prerequisite module',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  prerequisiteModuleId: string;

  @ApiProperty({
    description: 'ID of the postrequisite module',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  postrequisiteModuleId: string;

  @ApiPropertyOptional({
    description: 'Optional metadata for the relationship',
    type: 'object',
    example: {
      REASON: 'Foundation concepts required',
      TYPE: 'hard',
      DESCRIPTION: 'Students must complete linear algebra before calculus',
    },
  })
  @IsOptional()
  metadata?: {
    REASON?: string;
    TYPE?: string;
    DESCRIPTION?: string;
  };
}
