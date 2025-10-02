import { Injectable } from '@nestjs/common';
import { Module as ModuleEntity } from './models/Module.entity';
import { ModulesQueryDto } from './dto/modules-query.dto';
import { CreateModuleRelationshipInput } from './dto/create-module-relationship.input';
import { DeleteModuleRelationshipInput } from './dto/delete-module-relationship.input';
import { ModuleRelationshipResult } from './dto/module-relationship-result.type';
import { CreateModuleInput } from './dto/create-module.input';
import { CreateManyModulesInput } from './dto/create-many-modules.input';
import { UpdateModuleInput } from './dto/update-module.input';
import { ModulesQueryService } from './services/modules-query.service';
import { ModulesCrudService } from './services/modules-crud.service';
import { ModulesRelationshipService } from './services/modules-relationship.service';
import { ModulesSummaryService } from './services/modules-summary.service';

@Injectable()
export class ModulesService {
  constructor(
    private readonly queryService: ModulesQueryService,
    private readonly crudService: ModulesCrudService,
    private readonly relationshipService: ModulesRelationshipService,
    private readonly summaryService: ModulesSummaryService,
  ) {}

  async findUnique(id: string) {
    return this.queryService.findUnique(id);
  }

  async findAll(filters?: ModulesQueryDto) {
    return this.queryService.findAll(filters);
  }

  async findModulesByCourseId(courseId: string) {
    return this.queryService.findModulesByCourseId(courseId);
  }

  async create(input: CreateModuleInput): Promise<ModuleEntity> {
    return this.crudService.create(input);
  }

  async update(id: string, updateModuleInput: UpdateModuleInput) {
    return this.crudService.update(id, updateModuleInput);
  }

  async createMany(input: CreateManyModulesInput) {
    return this.crudService.createMany(input);
  }

  async delete(id: string) {
    return this.crudService.delete(id);
  }

  async createModuleRelationship(
    relationshipData: CreateModuleRelationshipInput,
  ): Promise<ModuleRelationshipResult> {
    return this.relationshipService.createModuleRelationship(relationshipData);
  }

  async deleteModuleRelationship(
    relationshipData: DeleteModuleRelationshipInput,
  ): Promise<ModuleRelationshipResult> {
    return this.relationshipService.deleteModuleRelationship(relationshipData);
  }

  async generateSummary(id: string): Promise<string> {
    return this.summaryService.generateSummary(id);
  }

  async getModulesSummary(): Promise<
    Array<{ id: string; en_name: string; questions_amount: number }>
  > {
    return this.summaryService.getModulesSummary();
  }

  async getModulesByQuestionCount(limit?: number): Promise<
    Array<{ id: string; en_name: string; questions_amount: number }>
  > {
    return this.summaryService.getModulesByQuestionCount(limit);
  }
}