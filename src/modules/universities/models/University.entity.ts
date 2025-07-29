import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../../courses/models/Course.entity';
import { Degree } from '../../degrees/models/Degree.entity';
import { Translation } from '../../translations/models/Translation.entity';

export class University {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @ApiProperty({ type: () => [Course], required: false })
  courses?: Course[];

  @ApiProperty({ type: () => [Degree], required: false })
  degrees?: Degree[];
}
