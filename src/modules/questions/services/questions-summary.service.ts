import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class QuestionsSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async generateSummary(id: string): Promise<string> {
    try {
      const question = await this.prisma.question.findUnique({
        where: { id },
        include: {
          text: true,
          Modules: {
            include: { name: true },
          },
          Answer: {
            include: {
              SelectAnswer: {
                include: { text: true },
              },
              UnitAnswer: true,
              NumberAnswer: true,
              BooleanAnswer: true,
            },
          },
          Parts: true,
        },
      });

      if (!question) {
        throw new NotFoundException(`Question with ID ${id} not found`);
      }

      const questionText = question.text && question.text.en_text ? question.text.en_text : 'No English text available';
      const moduleNames = question.Modules
        ? question.Modules.map((module) => module.name && module.name.en_text ? module.name.en_text : 'Unknown Module')
            .join(', ')
        : 'No modules assigned';

      const summary = `Question Summary for ${id}

Text: ${questionText}
Type: ${question.type}
Validation Status: ${question.validationStatus}
Modules: ${moduleNames}

Question Details:
- Question ID: ${id}
- Type: ${question.type}
- Status: ${question.validationStatus}
- Associated Modules: ${question.Modules ? question.Modules.length : 0}
- Available Answers: ${question.Answer ? question.Answer.length : 0}
- Question Parts: ${question.Parts ? question.Parts.length : 0}`;

      return summary;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to generate summary for question: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}