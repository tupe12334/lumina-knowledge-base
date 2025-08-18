import { IsUUID } from 'class-validator';

export class DeleteModuleRelationshipDto {
  @IsUUID()
  prerequisiteModuleId: string;

  @IsUUID()
  postrequisiteModuleId: string;
}
