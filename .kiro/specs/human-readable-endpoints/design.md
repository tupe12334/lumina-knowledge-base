# Design Document

## Overview

This design implements human-readable REST endpoints that provide natural language summaries of academic entities for AI consumption. The endpoints return plain text responses containing contextual information about institutions, courses, modules, questions, and degrees based on the existing Prisma database schema.

## Architecture

### Endpoint Structure

- Base path: `/api/{entity}/{id}/summary`
- Response format: `text/plain`
- HTTP methods: GET only
- Authentication: None required (read-only endpoints)

### Supported Endpoints

1. `GET /api/institutions/{id}/summary`
2. `GET /api/courses/{id}/summary`
3. `GET /api/modules/{id}/summary`
4. `GET /api/questions/{id}/summary`
5. `GET /api/degrees/{id}/summary`

## Components and Interfaces

### Controller Layer

Each existing controller will be extended with a new summary endpoint:

- `InstitutionsController.getSummary(id: string)`
- `CoursesController.getSummary(id: string)`
- `ModulesController.getSummary(id: string)`
- `QuestionsController.getSummary(id: string)`
- `DegreesController.getSummary(id: string)`

### Service Layer

Each service will implement a summary generation method:

- `InstitutionsService.generateSummary(id: string): Promise<string>`
- `CoursesService.generateSummary(id: string): Promise<string>`
- `ModulesService.generateSummary(id: string): Promise<string>`
- `QuestionsService.generateSummary(id: string): Promise<string>`
- `DegreesService.generateSummary(id: string): Promise<string>`

### Summary Generator Interface

```typescript
interface SummaryGenerator {
  generateSummary(id: string): Promise<string>;
}
```

## Data Models

### Institution Summary Format

```
Institution: [name from en_text]
ID: [institution_id]
Faculties: [count] faculties including [faculty names from en_text]
Degrees: [count] degree programs
Courses: [count] courses offered
Faculty Details: [faculty descriptions from en_text where available]
```

### Course Summary Format

```
Course: [name from en_text]
ID: [course_id]
Institution: [institution name from en_text]
Associated Degrees: [degree names from en_text]
Modules: [count] modules - [module names from en_text]
Prerequisites: [prerequisite courses via Block relationships]
Postrequisites: [courses that require this course via Block relationships]
```

### Module Summary Format

```
Module: [name from en_text]
ID: [module_id]
Associated Courses: [course names from en_text]
Questions: [count] questions of types [question types]
Parent Modules: [parent module names from en_text]
Sub-modules: [sub-module names from en_text]
Prerequisites: [prerequisite modules via Block relationships]
Postrequisites: [modules that require this module via Block relationships]
```

### Question Summary Format

```
Question: [text from en_text]
ID: [question_id]
Type: [selection/value/void]
Validation Status: [ai_generated/in_manual_review/approved/rejected]
Associated Modules: [module names from en_text]
Answer Options: [for selection type - answer texts from en_text with correct indicators]
Answer Type: [for value type - unit/number with expected values]
Question Parts: [if composite question - part question texts]
```

### Degree Summary Format

```
Degree: [name from en_text]
ID: [degree_id]
Institution: [institution name from en_text]
Faculty: [faculty name from en_text if assigned, otherwise "Not assigned to specific faculty"]
Associated Courses: [count] courses - [course names from en_text]
```

## Error Handling

### HTTP Status Codes

- `200 OK`: Successful summary generation
- `404 Not Found`: Entity with specified ID does not exist
- `400 Bad Request`: Invalid ID format (non-UUID)
- `500 Internal Server Error`: Database or processing errors

### Error Response Format

Plain text error messages:

```
Error: Institution with ID [id] not found
Error: Invalid ID format provided
Error: Unable to generate summary due to server error
```

## Testing Strategy

### Unit Tests

- Test each service's `generateSummary` method with valid IDs
- Test error handling for non-existent IDs
- Test translation data extraction (en_text field usage)
- Test relationship data inclusion

### Integration Tests

- Test complete endpoint responses for each entity type
- Test HTTP status codes for various scenarios
- Test response content type (text/plain)
- Test with real database data

### E2E Tests

- Test all five summary endpoints with sample data
- Test error scenarios (404, 400, 500)
- Test response format consistency
- Test relationship data accuracy

## Implementation Notes

### Database Queries

Each summary generator will use Prisma's `include` option to fetch related data:

- Institution: include faculties, degrees, courses with translations
- Course: include institution, degrees, modules, block relationships with translations
- Module: include courses, questions, parent/sub-modules, block relationships with translations
- Question: include modules, answers, question parts with translations
- Degree: include institution, faculty, courses with translations

### Translation Handling

All summary generators will:

1. Extract `en_text` from Translation relations
2. Handle missing translations gracefully
3. Provide fallback text when translations are unavailable

### Performance Considerations

- Use selective field inclusion to minimize data transfer
- Consider caching for frequently accessed summaries
- Implement query optimization for complex relationship fetching
