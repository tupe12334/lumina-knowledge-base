import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { University } from './models/University.entity';
import { CreateUniversityInput } from './dto/create-university.input';
import { UpdateUniversityInput } from './dto/update-university.input';

@Injectable()
export class UniversitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<University[]> {
    const universities = await this.prisma.university.findMany({
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

    return universities;
  }

  async findUnique(id: string): Promise<University | null> {
    const university = await this.prisma.university.findUnique({
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

    if (!university) {
      return null;
    }

    return university;
  }

  /**
   * Creates a new university.
   * @param input - The data for creating the university
   * @returns The newly created university
   */
  async create(input: CreateUniversityInput): Promise<University> {
    const { en_text, he_text } = input;

    // Create a new translation for the university name
    const translation = await this.prisma.translation.create({
      data: {
        en_text,
        he_text,
      },
    });

    // Create the university, linking it to the translation
    const university = await this.prisma.university.create({
      data: {
        translationId: translation.id,
      },
      include: {
        name: true,
      },
    });

    return university;
  }

  async update(id: string, updateUniversityInput: UpdateUniversityInput) {
    return this.prisma.university.update({
      where: { id },
      data: updateUniversityInput,
    });
  }

  async remove(id: string) {
    return this.prisma.university.delete({ where: { id } });
  }

  /**
   * Generates a human-readable summary of a university including its faculties, degrees, and courses.
   * @param id - The university ID
   * @returns A plain text summary of the university
   * @throws NotFoundException if the university doesn't exist
   */
  async generateSummary(id: string): Promise<string> {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        name: true,
        faculties: {
          include: {
            name: true,
          },
        },
        Degree: {
          include: {
            name: true,
          },
        },
        courses: {
          include: {
            name: true,
          },
        },
      },
    });

    if (!university) {
      throw new Error(`University with ID ${id} not found`);
    }

    const universityName =
      university.name?.en_text || 'No English translation available';

    // Build faculty information
    const facultyCount = university.faculties.length;
    const facultyNames = university.faculties
      .map(
        (faculty) =>
          faculty.name?.en_text || 'No English translation available',
      )
      .join(', ');

    // Build degree and course counts
    const degreeCount = university.Degree.length;
    const courseCount = university.courses.length;

    // Build faculty details section
    const facultyDetails =
      university.faculties.length > 0
        ? university.faculties
            .map((faculty) => {
              const name =
                faculty.name?.en_text || 'No English translation available';
              return `- ${name}`;
            })
            .join('\n')
        : 'No faculties available';

    const summary = `University: ${universityName}
ID: ${university.id}
Faculties: ${facultyCount} faculties including ${facultyNames || 'none'}
Degrees: ${degreeCount} degree programs
Courses: ${courseCount} courses offered
Faculty Details:
${facultyDetails}`;

    return summary;
  }
}
