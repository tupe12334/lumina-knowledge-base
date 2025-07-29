import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../../courses/models/Course.entity';
import { Translation } from '../../translations/models/Translation.entity';

export class Discipline {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @ApiProperty({ type: () => [Course], required: false })
  courses?: Course[];
}
