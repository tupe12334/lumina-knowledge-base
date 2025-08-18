import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Course } from '../../courses/models/Course.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { University } from '../../universities/models/University.entity';
import { Faculty } from '../../faculties/models/Faculty.entity';

@ObjectType()
export class Degree {
  @Field(() => ID)
  id!: string;

  @Field(() => Translation)
  @Type(() => Translation)
  name!: Translation;

  @Field()
  universityId!: string;

  @Field(() => University, { nullable: true })
  university?: University;

  @Field(() => [Course], { nullable: true })
  courses?: Course[];

  @Field(() => String, { nullable: true })
  facultyId?: string | null;

  @Field(() => Faculty, { nullable: true })
  faculty?: Faculty | null;
}
