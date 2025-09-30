import { Injectable } from '@nestjs/common';
import { CourseDeletionTransaction } from '../types/course-deletion-transaction.type';

@Injectable()
export class CourseDeletionConnectorService {
  async disconnectModuleFromCourse(tx: CourseDeletionTransaction, courseId: string, moduleId: string) {
    await tx.course.update({
      where: { id: courseId },
      data: {
        modules: {
          disconnect: { id: moduleId },
        },
      },
    });
  }
}