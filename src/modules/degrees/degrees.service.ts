import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Degree } from './models/Degree.entity';
import { DegreesQueryDto } from './dto/degrees-query.dto';
import { CreateDegreeInput } from './dto/create-degree.input';
import { CreateManyDegreesInput } from './dto/create-many-degrees.input';
import { UpdateDegreeInput } from './dto/update-degree.input';
import { DegreesSummaryService } from './services/degrees-summary.service';
import { DegreesRelationshipService } from './services/degrees-relationship.service';
import { DegreesQueryService } from './services/degrees-query.service';
import { DegreesCrudService } from './services/degrees-crud.service';

type OptionalString = string | null;

/**
 * Service for managing degree operations.
 * Handles CRUD operations for degrees including retrieving degrees
 * with their associated university and courses.
 */
@Injectable()
export class DegreesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly summaryService: DegreesSummaryService,
    private readonly relationshipService: DegreesRelationshipService,
    private readonly queryService: DegreesQueryService,
    private readonly crudService: DegreesCrudService,
  ) {}

  async create(createDegreeInput: CreateDegreeInput): Promise<Degree> {
    return this.crudService.create(createDegreeInput);
  }

  /**
   * Creates multiple degrees in a single transaction.
   * @param input - The data for creating multiple degrees
   * @returns The number of degrees created
   */
  async createMany(input: CreateManyDegreesInput) {
    return this.crudService.createMany(input);
  }

  /**
   * Retrieves all degrees from the database.
   * Includes related university and course information.
   * @returns Promise<Degree[]> Array of all degrees
   */
  async findAll(query?: DegreesQueryDto): Promise<Degree[]> {
    const result = await this.queryService.findAll(query);
    return result as unknown as Degree[];
  }

  /**
   * Retrieves a specific degree by its ID.
   * Includes related university and course information.
   * @param id - The unique identifier of the degree
   * @returns Promise<Degree | null> The degree if found, null otherwise
   */
  async findUnique(id: string): Promise<Degree | null> {
    const result = await this.queryService.findUnique(id);
    return result as unknown as Degree | null;
  }

  async update(
    id: string,
    updateDegreeInput: UpdateDegreeInput,
  ): Promise<Degree> {
    return this.crudService.update(id, updateDegreeInput);
  }

  async delete(id: string): Promise<Degree> {
    return this.crudService.delete(id);
  }

  /**
   * Retrieves all degrees for a specific university.
   * @param universityId - The unique identifier of the university
   * @returns Promise<Degree[]> Array of degrees for the specified university
   */
  async findByUniversityId(institutionId: string): Promise<Degree[]> {
    const result = await this.queryService.findByUniversityId(institutionId);
    return result as unknown as Degree[];
  }

  /**
   * Retrieves all degrees for a specific faculty.
   * @param facultyId - The unique identifier of the faculty
   * @returns Promise<Degree[]> Array of degrees for the specified faculty
   */
  async findByFacultyId(facultyId: string): Promise<Degree[]> {
    const result = await this.queryService.findByFacultyId(facultyId);
    return result as unknown as Degree[];
  }

  /**
   * Sets or clears the faculty for a given degree.
   * @param degreeId - The degree to update
   * @param facultyId - The faculty to assign (null to clear)
   * @returns Updated Degree with relations
   */
  async setFacultyForDegree(
    degreeId: string,
    facultyId: OptionalString,
  ): Promise<Degree> {
    return this.relationshipService.setFacultyForDegree(degreeId, facultyId);
  }

  /**
   * Adds a course to a degree.
   * @param degreeId - The ID of the degree to add the course to.
   * @param courseId - The ID of the course to add.
   * @returns The updated degree with the course added.
   */
  async addCourse(degreeId: string, courseId: string): Promise<Degree> {
    return this.relationshipService.addCourse(degreeId, courseId);
  }

  /**
   * Removes a course from a degree.
   * @param degreeId - The ID of the degree to remove the course from.
   * @param courseId - The ID of the course to remove.
   * @returns The updated degree with the course removed.
   */
  async removeCourse(degreeId: string, courseId: string): Promise<Degree> {
    return this.relationshipService.removeCourse(degreeId, courseId);
  }

  /**
   * Gets all courses associated with a specific degree.
   * @param degreeId - The degree ID
   * @returns Array of courses for the degree
   * @throws NotFoundException if the degree doesn't exist
   */
  async getCoursesByDegreeId(degreeId: string) {
    return this.relationshipService.getCoursesByDegreeId(degreeId);
  }

  /**
   * Generates a human-readable summary of a degree including its university, faculty, and courses.
   * @param id - The degree ID
   * @returns A plain text summary of the degree
   * @throws NotFoundException if the degree doesn't exist
   * @throws InternalServerErrorException if database operation fails
   */
  async generateSummary(id: string): Promise<string> {
    return this.summaryService.generateSummary(id);
  }
}
