import { ApiProperty } from '@nestjs/swagger';
import { Translation } from '../../translations/models/Translation.entity';
import { Degree } from '../../degrees/models/Degree.entity';

export class Faculty {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @ApiProperty({ type: () => Translation })
  description: Translation;

  @ApiProperty({ type: () => [Degree], nullable: true })
  degrees?: Degree[];
}
