import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Institution } from '../../institutions/models/Institution.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { Module } from '../../modules/models/Module.entity';
import { Block } from 'src/modules/blocks/models/Block.entity';

export class Course {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => Translation })
  @Type(() => Translation)
  name!: Translation;

  @ApiProperty()
  institutionId!: string;

  @ApiProperty({ type: () => Institution, nullable: true })
  institution?: Institution;

  @ApiProperty({ type: () => [Module], nullable: true })
  modules?: Module[];

  @ApiProperty({ type: () => Date, nullable: true })
  publishedAt!: OptionalDate;

  @ApiProperty({ type: () => Block, nullable: true })
  Block?: Block;
}

type OptionalDate = Date | null;
