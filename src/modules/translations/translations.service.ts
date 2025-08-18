import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTranslationInput } from './dto/create-translation.input';
import { UpdateTranslationInput } from './dto/update-translation.input';

@Injectable()
export class TranslationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTranslationInput) {
    return this.prisma.translation.create({ data });
  }

  async findAll() {
    return this.prisma.translation.findMany();
  }

  async findOne(id: string) {
    return this.prisma.translation.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateTranslationInput) {
    return this.prisma.translation.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.translation.delete({ where: { id } });
  }
}
