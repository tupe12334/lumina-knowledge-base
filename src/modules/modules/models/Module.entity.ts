import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Translation } from '../../translations/models/Translation.entity';
import { Block } from 'src/modules/blocks/models/Block.entity';
import { Question } from '../../questions/models/Question.entity';

export class Module {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => Translation })
  @Type(() => Translation)
  name!: Translation;

  @ApiProperty()
  translationId!: string;

  @ApiProperty({ type: () => [Module], nullable: true })
  subModules?: Module[];

  @ApiProperty({ type: () => [Module], nullable: true })
  parentModules?: Module[];

  @ApiProperty({ type: () => Block, nullable: true })
  Block?: Block;

  @ApiProperty({ type: () => [Question], nullable: true })
  questions?: Question[];
}
