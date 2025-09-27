import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseDeletionConnectorService {
  async disconnectModuleFromCourse(tx: unknown, courseId: string, moduleId: string) {
    const typedTx = tx as {
      course: {
        update: (args: unknown) => Promise<unknown>;
      };
    };

    await typedTx.course.update({
      where: { id: courseId },
      data: {
        modules: {
          disconnect: { id: moduleId },
        },
      },
    });
  }
}