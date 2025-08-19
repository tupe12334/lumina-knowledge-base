import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleRelationshipDto {
  @ApiProperty()
  @IsUUID()
  prerequisiteModuleId: string;

  @ApiProperty()
  @IsUUID()
  postrequisiteModuleId: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { REASON: 'some reason', TYPE: 'some type' },
  })
  @IsOptional()
  metadata?: {
    REASON?: string;
    TYPE?: string;
    DESCRIPTION?: string;
  };
}
