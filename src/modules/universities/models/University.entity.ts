import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Course } from '../../courses/models/Course.entity';
import { Degree } from '../../degrees/models/Degree.entity';
import { Translation } from '../../translations/models/Translation.entity';

@ObjectType()
export class University {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field(() => Translation)
  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @Field(() => [Course], { nullable: true })
  @ApiProperty({ type: () => [Course], required: false })
  courses?: Course[];

  @Field(() => [Degree], { nullable: true })
  @ApiProperty({ type: () => [Degree], required: false })
  degrees?: Degree[];
}
