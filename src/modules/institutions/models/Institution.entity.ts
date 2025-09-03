import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Course } from '../../courses/models/Course.entity';
import { Degree } from '../../degrees/models/Degree.entity';
import { Translation } from '../../translations/models/Translation.entity';

export class Institution {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => Translation })
  @Type(() => Translation)
  name!: Translation;

  @ApiProperty({ type: () => [Course], nullable: true })
  @Type(() => Course)
  courses?: Course[];

  @ApiProperty({ type: () => [Degree], nullable: true })
  @Type(() => Degree)
  degrees?: Degree[];
}
