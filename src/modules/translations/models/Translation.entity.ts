import { ObjectType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class Translation {
  @ApiProperty()
  @Field()
  id!: string;

  @ApiProperty()
  @Field()
  en_text!: string;

  @ApiProperty()
  @Field()
  he_text!: string;
}
