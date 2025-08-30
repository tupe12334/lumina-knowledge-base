import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Course } from '../../courses/models/Course.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { Institution } from '../../institutions/models/Institution.entity';
import { Faculty } from '../../faculties/models/Faculty.entity';

type OptionalString = string | null;
type OptionalFaculty = Faculty | null;

@ObjectType()
export class Degree {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty({ type: () => Translation })
  @Field(() => Translation)
  @Type(() => Translation)
  name!: Translation;

  @ApiProperty()
  @Field()
  institutionId!: string;

  @ApiProperty({ type: () => Institution, nullable: true })
  @Field(() => Institution, { nullable: true })
  institution?: Institution;

  @ApiProperty({ type: () => [Course], nullable: true })
  @Field(() => [Course], { nullable: true })
  courses?: Course[];

  @ApiProperty({ type: () => String, nullable: true })
  @Field(() => String, { nullable: true })
  facultyId?: OptionalString;

  @ApiProperty({ type: () => Faculty, nullable: true })
  @Field(() => Faculty, { nullable: true })
  faculty?: OptionalFaculty;
}
