import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionIncludeBuilderService {
  buildQuestionInclude() {
    return {
      text: true,
      Modules: {
        include: {
          name: true,
        },
      },
      Parts: {
        include: {
          partQuestion: {
            include: {
              text: true,
            },
          },
        },
      },
      PartOf: {
        include: {
          question: {
            include: {
              text: true,
            },
          },
        },
      },
      Answer: {
        include: {
          SelectAnswer: {
            include: {
              text: true,
            },
          },
          UnitAnswer: true,
          NumberAnswer: true,
          BooleanAnswer: true,
        },
      },
    };
  }
}