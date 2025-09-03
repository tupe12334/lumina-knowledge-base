import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Course } from '../../courses/models/Course.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { Institution } from '../../institutions/models/Institution.entity';
import { Faculty } from '../../faculties/models/Faculty.entity';

export class Degree {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => Translation })
  @Type(() => Translation)
  name!: Translation;

  @ApiProperty()
  institutionId!: string;

  @ApiProperty({ type: () => Institution, nullable: true })
  institution?: Institution;

  @ApiProperty({ type: () => [Course], nullable: true })
  courses?: Course[];

  @ApiProperty({ type: () => String, nullable: true })
  facultyId?: string | null;

  @ApiProperty({ type: () => Faculty, nullable: true })
  faculty?: Faculty | null;
}
