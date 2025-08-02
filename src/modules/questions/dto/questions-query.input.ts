import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, IsBoolean, IsIn } from 'class-validator';

enum QuestionTypeEnum {
  SELECTION = 'selection',
  VALUE = 'value',
  VOID = 'void',
}

registerEnumType(QuestionTypeEnum, {
  name: 'QuestionType',
  description: 'The type of question',
});

@InputType()
export class QuestionsQueryInput {
  @Field({ nullable: true, description: 'Filter questions by module ID' })
  @IsOptional()
  @IsString()
  @IsUUID()
  moduleId?: string;

  @Field({ nullable: true, description: 'Filter questions by course ID' })
  @IsOptional()
  @IsString()
  @IsUUID()
  courseId?: string;

  @Field(() => QuestionTypeEnum, {
    nullable: true,
    description: 'Filter questions by question type',
  })
  @IsOptional()
  @IsIn(['selection', 'value', 'void'])
  questionType?: QuestionTypeEnum;

  @Field({
    nullable: true,
    description: 'Exclude questions that are part of other questions',
  })
  @IsOptional()
  @IsBoolean()
  excludePartQuestions?: boolean;
}
