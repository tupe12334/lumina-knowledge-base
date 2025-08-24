import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Institution } from './models/Institution.entity';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { CreateManyInstitutionsInput } from './dto/create-many-institutions.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';

@Injectable()
export class InstitutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Institution[]> {
    const institutions = await this.prisma.institution.findMany({
      include: {
        courses: {
          include: { name: true },
        },
        name: true,
        Degree: {
          include: { name: true },
        },
      },
    });

    return institutions;
  }

  async findUnique(id: string): Promise<Institution | null> {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        courses: {
          include: { name: true },
        },
        name: true,
        Degree: {
          include: { name: true },
        },
      },
    });

    if (!institution) {
      return null;
    }

    return institution;
  }

  /**
   * Creates a new institution.
   * @param input - The data for creating the institution
   * @returns The newly created institution
   */
  async create(input: CreateInstitutionInput): Promise<Institution> {
    const { en_text, he_text } = input;

    // Create a new translation for the institution name
    const translation = await this.prisma.translation.create({
      data: {
        en_text,
        he_text,
      },
    });

    // Create the institution, linking it to the translation
    const institution = await this.prisma.institution.create({
      data: {
        translationId: translation.id,
      },
      include: {
        name: true,
      },
    });

    return institution;
  }

  /**
   * Creates multiple institutions in a single transaction.
   * @param input - The data for creating multiple institutions
   * @returns The number of institutions created
   */
  async createMany(input: CreateManyInstitutionsInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const institutionData of input.universities) {
        const { en_text, he_text } = institutionData;

        // Create a new translation for each institution name
        const translation = await prisma.translation.create({
          data: {
            en_text,
            he_text,
          },
        });

        // Create the institution, linking it to the translation
        await prisma.institution.create({
          data: {
            translationId: translation.id,
          },
        });

        createdCount++;
      }

      return { count: createdCount };
    });
  }

  async update(id: string, updateInstitutionInput: UpdateInstitutionInput) {
    return this.prisma.institution.update({
      where: { id },
      data: updateInstitutionInput,
    });
  }

  async remove(id: string) {
    return this.prisma.institution.delete({ where: { id } });
  }

  /**
   * Generates a human-readable summary of an institution including its faculties, degrees, and courses.
   * @param id - The institution ID
   * @returns A plain text summary of the institution
   * @throws NotFoundException if the institution doesn't exist
   * @throws InternalServerErrorException if database operation fails
   */
  async generateSummary(id: string): Promise<string> {
    try {
      const institution = await this.prisma.institution.findUnique({
        where: { id },
        include: {
          name: true,
          Faculty: { include: { name: true } },
          Degree: { include: { name: true } },
          courses: { include: { name: true } },
        },
      });

      if (!institution) {
        throw new NotFoundException(`Institution with ID ${id} not found`);
      }

      const institutionName =
        institution.name?.en_text || 'No English translation available';

      // Build faculty information
      const facultyCount = institution.Faculty.length;
      const facultyNames = institution.Faculty.map(
        (f) => f.name?.en_text || 'No English translation available',
      ).join(', ');

      // Build degree and course counts
      const degreeCount = institution.Degree.length;
      const courseCount = institution.courses.length;

      // Build faculty details section
      const facultyDetails =
        institution.Faculty.length > 0
          ? institution.Faculty.map(
              (f) =>
                `- ${f.name?.en_text || 'No English translation available'}`,
            ).join('\n')
          : 'No faculties available';

      const summary = `Institution: ${institutionName}
ID: ${institution.id}
Faculties: ${facultyCount} faculties including ${facultyNames || 'none'}
Degrees: ${degreeCount} degree programs
Courses: ${courseCount} courses offered
Faculty Details:
${facultyDetails}`;

      return summary;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to generate institution summary: ${error.message}`,
      );
    }
  }
}