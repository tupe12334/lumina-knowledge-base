import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { DegreesService } from './degrees.service';
import { Degree } from './models/Degree.entity';

/**
 * Controller for degree-related endpoints.
 * Provides REST API endpoints for retrieving degree information.
 */
@ApiTags('degrees')
@Controller('degrees')
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  /**
   * Retrieves all degrees from the system.
   * @returns Promise<Degree[]> Array of all degrees with their related data
   */
  @Get()
  @ApiOkResponse({ type: [Degree], description: 'List of all degrees' })
  async getDegrees(): Promise<Degree[]> {
    return this.degreesService.findAll();
  }

  /**
   * Retrieves a specific degree by its ID.
   * @param id - The unique identifier of the degree
   * @returns Promise<Degree | null> The degree if found, null otherwise
   */
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Degree ID', type: 'string' })
  @ApiOkResponse({ type: Degree, description: 'Degree details' })
  async getDegree(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Degree | null> {
    return this.degreesService.findUnique(id);
  }

  /**
   * Retrieves all degrees for a specific university.
   * @param universityId - The unique identifier of the university
   * @returns Promise<Degree[]> Array of degrees for the specified university
   */
  @Get('university/:universityId')
  @ApiParam({
    name: 'universityId',
    description: 'University ID',
    type: 'string',
  })
  @ApiOkResponse({
    type: [Degree],
    description: 'List of degrees for the university',
  })
  async getDegreesByUniversity(
    @Param('universityId', new ParseUUIDPipe()) universityId: string,
  ): Promise<Degree[]> {
    return this.degreesService.findByUniversityId(universityId);
  }

  /**
   * Retrieves all degrees for a specific university and discipline.
   * @param universityId - The unique identifier of the university
   * @param disciplineId - The unique identifier of the discipline
   * @returns Promise<Degree[]> Array of degrees for the specified university and discipline
   */
  @Get('university/:universityId/discipline/:disciplineId')
  @ApiParam({
    name: 'universityId',
    description: 'University ID',
    type: 'string',
  })
  @ApiParam({
    name: 'disciplineId',
    description: 'Discipline ID',
    type: 'string',
  })
  @ApiOkResponse({
    type: [Degree],
    description: 'List of degrees for the university and discipline',
  })
  async getDegreesByUniversityAndDiscipline(
    @Param('universityId', new ParseUUIDPipe()) universityId: string,
    @Param('disciplineId', new ParseUUIDPipe()) disciplineId: string,
  ): Promise<Degree[]> {
    return this.degreesService.findByUniversityIdAndDisciplineId(
      universityId,
      disciplineId,
    );
  }
}
