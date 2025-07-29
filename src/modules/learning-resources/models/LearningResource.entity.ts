import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '../../../../generated/client';

export class LearningResource {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  url!: string;

  @ApiProperty({ enum: $Enums.LearningResourceType })
  type!: $Enums.LearningResourceType;

  @ApiProperty()
  moduleId!: string;

  @ApiProperty()
  relevance!: number;

  @ApiProperty({ required: false })
  suggestedBy?: string | null;
}
