import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Course } from '../../courses/models/Course.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { University } from '../../universities/models/University.entity';

export class Degree {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @Type(() => Translation)
  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @ApiProperty()
  universityId!: string;

  @ApiProperty({ type: () => University, required: false })
  university?: University;

  @ApiProperty({ type: () => [Course], required: false })
  courses?: Course[];
}
