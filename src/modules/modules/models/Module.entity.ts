import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Translation } from '../../translations/models/Translation.entity';
import { Block } from 'src/modules/blocks/models/Block.entity';
import { LearningResource } from '../../learning-resources/models/LearningResource.entity';

export class Module {
  @ApiProperty()
  id!: string;

  @Type(() => Translation)
  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @ApiProperty({ type: () => [Module], required: false })
  subModules?: Module[];

  @ApiProperty({ type: () => [Module], required: false })
  parentModules?: Module[];

  @ApiProperty({ type: () => Block, required: false })
  Block?: Block;

  @ApiProperty({ type: () => [LearningResource], required: false })
  LearningResource?: LearningResource[];
}
