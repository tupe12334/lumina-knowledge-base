import { Injectable } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class ModulesDataExtractorService {
  extractModuleSummaryData(module: any) {
    const moduleName =
      (module.name && module.name.en_text) || 'No English translation available';

    const courseNames = module.Course.map(
      (course: any) => (course.name && course.name.en_text) || 'No English translation available',
    ).join(', ');

    const questionCount = module.Questions.length;
    const questionTypes = [
      ...new Set(module.Questions.map((q: any) => q.type)),
    ].join(', ');

    const parentModuleNames = module.parentModules
      .map(
        (parent: any) =>
          (parent.name && parent.name.en_text) || 'No English translation available',
      )
      .join(', ');

    const subModuleNames = module.subModules
      .map((sub: any) => (sub.name && sub.name.en_text) || 'No English translation available')
      .join(', ');

    const prerequisites = this.extractModulePrerequisites(module);
    const postrequisites = this.extractModulePostrequisites(module);

    return {
      moduleName,
      courseNames,
      questionCount,
      questionTypes,
      parentModuleNames,
      subModuleNames,
      prerequisites,
      postrequisites,
    };
  }

  private extractModulePrerequisites(module: any): string {
    if (!module.Block || !module.Block.postrequisiteOf) {
      return 'None';
    }

    const prerequisites = module.Block.postrequisiteOf
      .flatMap(
        (rel: any) =>
          (rel.prerequisite.Module && rel.prerequisite.Module.map(
            (m: any) => (m.name && m.name.en_text) || 'No English translation available',
          )) || [],
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return prerequisites || 'None';
  }

  private extractModulePostrequisites(module: any): string {
    if (!module.Block || !module.Block.prerequisiteFor) {
      return 'None';
    }

    const postrequisites = module.Block.prerequisiteFor
      .flatMap(
        (rel: any) =>
          (rel.postrequisite.Module && rel.postrequisite.Module.map(
            (m: any) => (m.name && m.name.en_text) || 'No English translation available',
          )) || [],
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return postrequisites || 'None';
  }
}