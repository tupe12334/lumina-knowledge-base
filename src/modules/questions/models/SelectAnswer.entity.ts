import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Translation } from '../../translations/models/Translation.entity';

@ObjectType()
export class SelectAnswer {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty()
  @Field()
  isCorrect!: boolean;

  @ApiProperty()
  @Field()
  translationId!: string;

  @ApiProperty({ type: () => Translation })
  @Field(() => Translation)
  text!: Translation;

  @ApiProperty()
  @Field()
  answerId!: string;
}