import { Injectable } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class CourseTextFormatterService {
  extractCourseSummaryData(course: any) {
    const courseName =
      (course.name && course.name.en_text) || 'No English translation available';
    const universityName =
      (course.institution && course.institution.name && course.institution.name.en_text) || 'No English translation available';

    const degreeNames = course.Degree.map(
      (degree: any) => (degree.name && degree.name.en_text) || 'No English translation available'
    ).join(', ');

    const moduleCount = course.modules.length;
    const moduleNames = course.modules
      .map((module: any) => (module.name && module.name.en_text) || 'No English translation available')
      .join(', ');

    const prerequisites = this.extractCoursePrerequisites(course);
    const postrequisites = this.extractCoursePostrequisites(course);

    return {
      courseName,
      universityName,
      degreeNames,
      moduleCount,
      moduleNames,
      prerequisites,
      postrequisites,
    };
  }

  private extractCoursePrerequisites(course: any): string {
    if (!course.Block || !course.Block.postrequisiteOf) {
      return 'None';
    }

    const prerequisites = course.Block.postrequisiteOf
      .flatMap((rel: any) =>
        rel.prerequisite.Course && rel.prerequisite.Course.map(
          (c: any) => (c.name && c.name.en_text) || 'No English translation available'
        ) || []
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return prerequisites || 'None';
  }

  private extractCoursePostrequisites(course: any): string {
    if (!course.Block || !course.Block.prerequisiteFor) {
      return 'None';
    }

    const postrequisites = course.Block.prerequisiteFor
      .flatMap((rel: any) =>
        rel.postrequisite.Course && rel.postrequisite.Course.map(
          (c: any) => (c.name && c.name.en_text) || 'No English translation available'
        ) || []
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return postrequisites || 'None';
  }

  buildCourseSummary(course: any, data: any): string {
    return `Course: ${data.courseName}
ID: ${course.id}
Institution: ${data.universityName}
Associated Degrees: ${data.degreeNames || 'None'}
Modules: ${data.moduleCount} modules - ${data.moduleNames || 'None'}
Prerequisites: ${data.prerequisites}
Postrequisites: ${data.postrequisites}`;
  }
}