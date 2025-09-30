import { Injectable } from '@nestjs/common';
import { ModulesQueryDto } from '../dto/modules-query.dto';

@Injectable()
export class ModulesQueryConverterService {
  /**
   * Converts string boolean values to actual booleans in query parameters
   */
  convertQueryParameters(query: ModulesQueryDto): ModulesQueryDto {
    const convertedQuery = { ...query };

    // Convert string 'true'/'false' to boolean values
    if (typeof query.fewQuestions === 'string') {
      convertedQuery.fewQuestions = String(query.fewQuestions).toLowerCase() === 'true';
    }
    if (typeof query.hasQuestions === 'string') {
      convertedQuery.hasQuestions = String(query.hasQuestions).toLowerCase() === 'true';
    }
    if (typeof query.hasPrerequisites === 'string') {
      convertedQuery.hasPrerequisites = String(query.hasPrerequisites).toLowerCase() === 'true';
    }
    if (typeof query.hasPostrequisites === 'string') {
      convertedQuery.hasPostrequisites = String(query.hasPostrequisites).toLowerCase() === 'true';
    }
    if (typeof query.hasSubModules === 'string') {
      convertedQuery.hasSubModules = String(query.hasSubModules).toLowerCase() === 'true';
    }
    if (typeof query.hasParentModules === 'string') {
      convertedQuery.hasParentModules = String(query.hasParentModules).toLowerCase() === 'true';
    }

    return convertedQuery;
  }
}