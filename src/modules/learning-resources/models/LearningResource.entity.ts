import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { $Enums } from '../../../../generated/client';

registerEnumType($Enums.LearningResourceType, {
  name: 'LearningResourceType',
});

@ObjectType()
export class LearningResource {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field()
  @ApiProperty()
  createdAt!: Date;

  @Field()
  @ApiProperty()
  updatedAt!: Date;

  @Field()
  @ApiProperty()
  url!: string;

  @Field(() => $Enums.LearningResourceType)
  @ApiProperty({ enum: $Enums.LearningResourceType })
  type!: $Enums.LearningResourceType;

  @Field()
  @ApiProperty()
  moduleId!: string;

  @Field()
  @ApiProperty()
  relevance!: number;

  @Field(() => String, { nullable: true })
  @ApiProperty({ required: false })
  suggestedBy?: string | null;
}
