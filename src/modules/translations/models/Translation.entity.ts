import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Translation {
  @Field()
  @ApiProperty()
  en_text!: string;

  @Field()
  @ApiProperty()
  he_text!: string;
}
