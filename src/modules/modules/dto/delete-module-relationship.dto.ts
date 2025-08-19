import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteModuleRelationshipDto {
  @ApiProperty()
  @IsUUID()
  prerequisiteModuleId: string;

  @ApiProperty()
  @IsUUID()
  postrequisiteModuleId: string;
}
