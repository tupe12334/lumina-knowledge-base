import { Injectable } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class ModulesTextBuilderService {
  buildModuleSummary(module: any, data: any): string {
    return `Module: ${data.moduleName}
ID: ${module.id}
Associated Courses: ${data.courseNames || 'None'}
Questions: ${data.questionCount} questions of types ${data.questionTypes || 'None'}
Parent Modules: ${data.parentModuleNames || 'None'}
Sub-modules: ${data.subModuleNames || 'None'}
Prerequisites: ${data.prerequisites}
Postrequisites: ${data.postrequisites}`;
  }
}