import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { University } from '../../universities/models/University.entity';
import { Discipline } from '../../disciplines/models/Discipline.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { Module } from '../../modules/models/Module.entity';
import { Block } from 'src/modules/blocks/models/Block.entity';

export class Course {
  @ApiProperty()
  id!: string;

  @Type(() => Translation)
  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @ApiProperty()
  universityId!: string;

  @ApiProperty()
  disciplineId!: string;

  @ApiProperty({ type: () => University, required: false })
  university?: University;

  @ApiProperty({ type: () => Discipline, required: false })
  discipline?: Discipline;

  @ApiProperty({ type: () => [Module], required: false })
  modules?: Module[];

  @ApiProperty({ nullable: true })
  publishedAt!: Date | null;

  @ApiProperty({ nullable: true })
  Block?: Block;
}
