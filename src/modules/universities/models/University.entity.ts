import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Course } from '../../courses/models/Course.entity';
import { Degree } from '../../degrees/models/Degree.entity';
import { Translation } from '../../translations/models/Translation.entity';

@ObjectType()
export class University {
  @Field(() => ID)
  id!: string;

  @Field(() => Translation)
  name!: Translation;

  @Field(() => [Course], { nullable: true })
  courses?: Course[];

  @Field(() => [Degree], { nullable: true })
  degrees?: Degree[];
}
