# Implementation Plan

- [-] 1. Create summary service methods for existing entities
  - Add generateSummary methods to existing services that fetch entity data with relationships and generate human-readable text
  - Implement proper error handling for non-existent entities
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3_

- [x] 1.1 Implement UniversitiesService.generateSummary method
  - Write method to fetch university with faculties, degrees, and courses including translations
  - Generate natural language summary following the university format from design
  - Handle missing translation data gracefully
  - _Requirements: 1.3, 4.3, 5.1, 5.3_

- [x] 1.2 Implement CoursesService.generateSummary method
  - Write method to fetch course with university, degrees, modules, and block relationships including translations
  - Generate natural language summary following the course format from design
  - Include prerequisite and postrequisite information from block relationships
  - _Requirements: 1.1, 4.1, 5.1, 5.3_

- [x] 1.3 Implement ModulesService.generateSummary method
  - Write method to fetch module with courses, questions, parent/sub-modules, and block relationships including translations
  - Generate natural language summary following the module format from design
  - Handle module hierarchy relationships properly
  - _Requirements: 1.2, 4.2, 5.1, 5.3_

- [ ] 2. Create or extend controllers for missing entities
  - Create controllers for questions and degrees if they don't exist
  - Ensure consistent controller structure following existing patterns
  - _Requirements: 1.4, 1.5_

- [ ] 2.1 Create QuestionsService.generateSummary method
  - Write service method to fetch question with modules, answers, and question parts including translations
  - Generate natural language summary following the question format from design
  - Handle different question types (selection, value, void) appropriately
  - _Requirements: 1.4, 4.5, 5.1, 5.3_

- [ ] 2.2 Create DegreesService.generateSummary method
  - Write service method to fetch degree with university, faculty, and courses including translations
  - Generate natural language summary following the degree format from design
  - Handle optional faculty assignment properly
  - _Requirements: 1.5, 4.4, 5.1, 5.3_

- [ ] 3. Add summary endpoints to existing controllers
  - Add GET /:id/summary endpoints to universities, courses, and modules controllers
  - Implement proper HTTP status codes and content-type headers
  - Add Swagger documentation for new endpoints
  - _Requirements: 2.1, 2.4, 3.2, 3.3_

- [ ] 3.1 Add summary endpoint to UniversitiesController
  - Add GET /:id/summary route that calls UniversitiesService.generateSummary
  - Set Content-Type to text/plain and return plain text response
  - Add proper Swagger documentation with ApiOperation and ApiResponse decorators
  - _Requirements: 1.3, 2.1, 2.4_

- [ ] 3.2 Add summary endpoint to CoursesController
  - Add GET /:id/summary route that calls CoursesService.generateSummary
  - Set Content-Type to text/plain and return plain text response
  - Add proper Swagger documentation with ApiOperation and ApiResponse decorators
  - _Requirements: 1.1, 2.1, 2.4_

- [ ] 3.3 Add summary endpoint to ModulesController
  - Add GET /:id/summary route that calls ModulesService.generateSummary
  - Set Content-Type to text/plain and return plain text response
  - Add proper Swagger documentation with ApiOperation and ApiResponse decorators
  - _Requirements: 1.2, 2.1, 2.4_

- [ ] 4. Create controllers and endpoints for questions and degrees
  - Create complete controller structure for questions and degrees following existing patterns
  - Implement summary endpoints with proper error handling
  - _Requirements: 1.4, 1.5, 2.1, 2.4_

- [ ] 4.1 Create QuestionsController with summary endpoint
  - Create new controller following existing controller patterns
  - Add GET /:id/summary route that calls QuestionsService.generateSummary
  - Set Content-Type to text/plain and add proper Swagger documentation
  - _Requirements: 1.4, 2.1, 2.4_

- [ ] 4.2 Create DegreesController with summary endpoint
  - Create new controller following existing controller patterns
  - Add GET /:id/summary route that calls DegreesService.generateSummary
  - Set Content-Type to text/plain and add proper Swagger documentation
  - _Requirements: 1.5, 2.1, 2.4_

- [ ] 5. Implement comprehensive error handling
  - Add validation for UUID format in all summary endpoints
  - Implement proper error responses with appropriate HTTP status codes
  - Add error handling for database connection issues
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 5.1 Add ID validation to all summary endpoints
  - Implement UUID format validation using class-validator or similar
  - Return 400 Bad Request for invalid ID formats with descriptive error message
  - Test validation with various invalid ID formats
  - _Requirements: 3.2_

- [ ] 5.2 Add entity existence checking to all summary methods
  - Check if entity exists before generating summary in all service methods
  - Return 404 Not Found for non-existent entities with descriptive error message
  - Ensure consistent error message format across all endpoints
  - _Requirements: 3.1_

- [ ] 6. Write comprehensive tests for all summary functionality
  - Create unit tests for all service generateSummary methods
  - Create integration tests for all summary endpoints
  - Test error scenarios and edge cases
  - _Requirements: All requirements validation_

- [ ] 6.1 Write unit tests for service methods
  - Test generateSummary methods for all entities with mock data
  - Test error handling for non-existent entities
  - Test translation data extraction and fallback behavior
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.3, 5.4_

- [ ] 6.2 Write integration tests for summary endpoints
  - Test all five summary endpoints with real database data
  - Test HTTP status codes for success and error scenarios
  - Test response content type and format
  - Verify relationship data accuracy in responses
  - _Requirements: 2.1, 2.4, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5_
