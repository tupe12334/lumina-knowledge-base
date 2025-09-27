import { Injectable } from '@nestjs/common';
import { Institution } from './models/Institution.entity';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { CreateManyInstitutionsInput } from './dto/create-many-institutions.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';
import { InstitutionsQueryService } from './services/institutions-query.service';
import { InstitutionsCrudService } from './services/institutions-crud.service';
import { InstitutionsSummaryService } from './services/institutions-summary.service';

@Injectable()
export class InstitutionsService {
  constructor(
    private readonly queryService: InstitutionsQueryService,
    private readonly crudService: InstitutionsCrudService,
    private readonly summaryService: InstitutionsSummaryService,
  ) {}

  async findAll(): Promise<Institution[]> {
    return this.queryService.findAll();
  }

  async findUnique(id: string): Promise<Institution | null> {
    return this.queryService.findUnique(id);
  }

  async create(createInstitutionInput: CreateInstitutionInput): Promise<Institution> {
    return this.crudService.create(createInstitutionInput);
  }

  async createMany(input: CreateManyInstitutionsInput) {
    return this.crudService.createMany(input);
  }

  async update(id: string, updateInstitutionInput: UpdateInstitutionInput) {
    return this.crudService.update(id, updateInstitutionInput);
  }

  async remove(id: string) {
    return this.crudService.remove(id);
  }

  async generateSummary(id: string): Promise<string> {
    return this.summaryService.generateSummary(id);
  }
}