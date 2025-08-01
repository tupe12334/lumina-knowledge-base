import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Course } from '../../courses/models/Course.entity';
import { Translation } from '../../translations/models/Translation.entity';
import { University } from '../../universities/models/University.entity';

@ObjectType()
export class Degree {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field()
  @ApiProperty()
  createdAt!: Date;

  @Field()
  @ApiProperty()
  updatedAt!: Date;

  @Field(() => Translation)
  @Type(() => Translation)
  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @Field()
  @ApiProperty()
  universityId!: string;

  @Field(() => University, { nullable: true })
  @ApiProperty({ type: () => University, required: false })
  university?: University;

  @Field(() => [Course], { nullable: true })
  @ApiProperty({ type: () => [Course], required: false })
  courses?: Course[];
}
