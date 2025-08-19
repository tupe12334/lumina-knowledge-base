import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Translation } from '../../translations/models/Translation.entity';
import { Degree } from '../../degrees/models/Degree.entity';

@ObjectType()
export class Faculty {
  @ApiProperty()
  @Field(() => ID)
  id!: string;

  @ApiProperty({ type: () => Translation })
  @Field(() => Translation)
  name!: Translation;

  @ApiProperty({ type: () => Translation })
  @Field(() => Translation)
  description: Translation;

  @ApiProperty({ type: () => [Degree], nullable: true })
  @Field(() => [Degree], { nullable: 'itemsAndList' })
  degrees?: Degree[];
}
