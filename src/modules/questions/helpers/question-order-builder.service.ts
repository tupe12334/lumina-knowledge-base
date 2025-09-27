import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionOrderBuilderService {
  buildOrderBy(): Prisma.QuestionOrderByWithRelationInput[] {
    return [
      {
        text: {
          en_text: 'asc',
        },
      },
      {
        id: 'asc',
      },
    ];
  }
}