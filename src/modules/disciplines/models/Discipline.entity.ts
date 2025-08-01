import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Course } from '../../courses/models/Course.entity';
import { Translation } from '../../translations/models/Translation.entity';

@ObjectType()
export class Discipline {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field(() => Translation)
  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @Field(() => [Course], { nullable: true })
  @ApiProperty({ type: () => [Course], required: false })
  courses?: Course[];
}
