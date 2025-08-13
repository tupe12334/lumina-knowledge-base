import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteModuleRelationshipDto {
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
}
