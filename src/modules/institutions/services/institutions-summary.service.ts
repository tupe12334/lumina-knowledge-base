import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class InstitutionsSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async generateSummary(id: string): Promise<string> {
    try {
      const institution = await this.prisma.institution.findUnique({
        where: { id },
        include: {
          name: true,
          Faculty: {
            include: { name: true },
          },
          Degree: {
            include: { name: true },
          },
          courses: {
            include: { name: true },
          },
        },
      });

      if (!institution) {
        throw new NotFoundException(`Institution with ID ${id} not found`);
      }

      const institutionName = institution.name?.en_text || 'Unknown Institution';
      const facultyCount = institution.Faculty?.length || 0;
      const degreeCount = institution.Degree?.length || 0;
      const courseCount = institution.courses?.length || 0;

      const facultyNames = institution.Faculty
        ?.map((faculty) => faculty.name?.en_text || 'No English translation available')
        .slice(0, 5);

      const facultyList = facultyNames && facultyNames.length > 0
        ? facultyNames.join(', ')
        : 'No faculties available';

      const facultyDetails = institution.Faculty
        ?.map((faculty) => `- ${faculty.name?.en_text || 'No English translation available'}`)
        .join('\n') || 'No faculty details available';

      const summary = `Institution Summary for ${id}

Institution: ${institutionName}
ID: ${id}

Summary:
Faculties: ${facultyCount} faculties${facultyCount > 0 ? ` including ${facultyList}` : ''}
Degrees: ${degreeCount} degree programs
Courses: ${courseCount} courses offered

Faculty Details:
${facultyDetails}`;

      return summary;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Failed to generate institution summary: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}