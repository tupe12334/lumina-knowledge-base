import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class AddCourseToDegreeInput {
  @Field(() => String, { description: 'ID of the course to add' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @Field(() => String, { description: 'ID of the degree to add the course to' })
  @IsString()
  @IsNotEmpty()
  degreeId: string;
}
