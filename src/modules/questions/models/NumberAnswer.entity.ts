import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class NumberAnswer {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty()
  @Field(() => Float)
  value!: number;

  @ApiProperty()
  @Field()
  answerId!: string;
}