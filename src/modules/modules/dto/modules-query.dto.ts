import { IntQueryProperty, BooleanQueryProperty, StringQueryProperty, UuidQueryProperty } from '../decorators/query-property.decorator';

export class ModulesQueryDto {
  @IntQueryProperty()
  minQuestions?: number;
  @IntQueryProperty()
  maxQuestions?: number;
  @IntQueryProperty()
  exactQuestions?: number;

  @UuidQueryProperty()
  courseId?: string;
  @UuidQueryProperty()
  universityId?: string;
  @StringQueryProperty()
  nameSearch?: string;

  @BooleanQueryProperty()
  hasQuestions?: boolean;

  @BooleanQueryProperty()
  hasPrerequisites?: boolean;

  @BooleanQueryProperty()
  hasPostrequisites?: boolean;

  @BooleanQueryProperty()
  hasSubModules?: boolean;

  @BooleanQueryProperty()
  hasParentModules?: boolean;

  @BooleanQueryProperty()
  fewQuestions?: boolean;
}
