import { ApiProperty } from '@nestjs/swagger';
import { Discipline } from '../../disciplines/models/Discipline.entity';
import { Translation } from '../../translations/models/Translation.entity';

export class Faculty {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @ApiProperty({ type: () => Translation })
  description: Translation;

  @ApiProperty({ type: () => [Discipline], required: false })
  Discipline?: Discipline[];
}
