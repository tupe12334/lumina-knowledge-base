import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Institution } from '../models/Institution.entity';
import { CreateInstitutionInput } from '../dto/create-institution.input';
import { CreateManyInstitutionsInput } from '../dto/create-many-institutions.input';
import { UpdateInstitutionInput } from '../dto/update-institution.input';

@Injectable()
export class InstitutionsCrudService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInstitutionInput: CreateInstitutionInput): Promise<Institution> {
    const { en_text, he_text } = createInstitutionInput;

    const translation = await this.prisma.translation.create({
      data: {
        en_text,
        he_text,
      },
    });

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

  async createMany(input: CreateManyInstitutionsInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const institutionData of input.universities) {
        const { en_text, he_text } = institutionData;

        const translation = await prisma.translation.create({
          data: {
            en_text,
            he_text,
          },
        });

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
}