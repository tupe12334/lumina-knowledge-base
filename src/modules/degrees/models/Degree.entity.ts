import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Course } from '../../courses/models/Course.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { University } from '../../universities/models/University.entity';
import { Faculty } from '../../faculties/models/Faculty.entity';

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
  universityId!: string;

  @ApiProperty({ type: () => University, nullable: true })
  @Field(() => University, { nullable: true })
  university?: University;

  @ApiProperty({ type: () => [Course], nullable: true })
  @Field(() => [Course], { nullable: true })
  courses?: Course[];

  @ApiProperty({ type: () => String, nullable: true })
  @Field(() => String, { nullable: true })
  facultyId?: string | null;

  @ApiProperty({ type: () => Faculty, nullable: true })
  @Field(() => Faculty, { nullable: true })
  faculty?: Faculty | null;
}
