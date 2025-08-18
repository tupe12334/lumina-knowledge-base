import { IsUUID, IsOptional } from 'class-validator';

export class CreateModuleRelationshipDto {
  @IsUUID()
  prerequisiteModuleId: string;

  @IsUUID()
  postrequisiteModuleId: string;

  @IsOptional()
  metadata?: {
    REASON?: string;
    TYPE?: string;
    DESCRIPTION?: string;
  };
}
