import { ApiProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Translation } from '../../translations/models/Translation.entity';
import { Degree } from '../../degrees/models/Degree.entity';

@ObjectType()
export class Faculty {
  @Field(() => ID)
  @ApiProperty()
  id!: string;

  @Field(() => Translation)
  @ApiProperty({ type: () => Translation })
  name!: Translation;

  @Field(() => Translation)
  @ApiProperty({ type: () => Translation })
  description: Translation;

  @Field(() => [Degree], { nullable: 'itemsAndList' })
  @ApiProperty({ type: () => [Degree], required: false })
  degrees?: Degree[];
}
