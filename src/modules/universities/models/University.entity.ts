import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Course } from '../../courses/models/Course.entity';
import { Degree } from '../../degrees/models/Degree.entity';
import { Translation } from '../../translations/models/Translation.entity';

@ObjectType()
export class University {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty({ type: () => Translation })
  @Field(() => Translation)
  @Type(() => Translation)
  name!: Translation;

  @ApiProperty({ type: () => [Course], nullable: true })
  @Field(() => [Course], { nullable: true })
  @Type(() => Course)
  courses?: Course[];

  @ApiProperty({ type: () => [Degree], nullable: true })
  @Field(() => [Degree], { nullable: true })
  @Type(() => Degree)
  degrees?: Degree[];
}
