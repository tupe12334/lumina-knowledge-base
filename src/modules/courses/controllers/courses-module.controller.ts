import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Header,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';
import { CoursesService } from '../courses.service';
import { SetCourseModulesInput } from '../dto/set-course-modules.input';
import { Course } from '../models/Course.entity';

@ApiTags('courses')
@Controller('courses')
export class CoursesModuleController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post(':id/modules')
  @ApiOperation({
    summary: 'Set modules for a course',
    description: 'Sets or updates the modules associated with a course.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the course', type: String })
  @ApiOkResponse({
    type: Course,
    description: 'The course with the updated modules.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Course or Module not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  setModules(
    @Param('id') id: string,
    @Body() setCourseModulesDto: Omit<SetCourseModulesInput, 'courseId'>,
  ) {
    return this.coursesService.setCourseModules({
      ...setCourseModulesDto,
      courseId: id,
    });
  }

  @Get(':id/summary')
  @ApiOperation({
    summary: 'Get course summary',
    description:
      'Returns a human-readable plain text summary for the specified course.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the course',
    type: String,
  })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    description: 'Plain text summary of the course',
    schema: { type: 'string' },
  })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async getSummary(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<string> {
    try {
      return await this.coursesService.generateSummary(id);
    } catch (err: unknown) {
      if (err instanceof NotFoundException && err instanceof Error) {
        throw new NotFoundException(err.message);
      }
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes('not found')) {
        throw new NotFoundException(message);
      }
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
}