# Requirements Document

## Introduction

This feature adds human-readable REST endpoints that provide natural language summaries about academic entities (courses, modules, universities, questions, and degrees) searchable by ID. These endpoints are designed for AI systems to learn about existing database content by returning plain text, human-readable descriptions rather than structured data.

## Requirements

### Requirement 1

**User Story:** As an AI system, I want human-readable REST endpoints for academic entities, so that I can retrieve natural language descriptions of database content to understand the academic structure and relationships.

#### Acceptance Criteria

1. WHEN I make a GET request to `/api/courses/{id}/summary` THEN the system SHALL return a plain text human-readable summary of the course
2. WHEN I make a GET request to `/api/modules/{id}/summary` THEN the system SHALL return a plain text human-readable summary of the module
3. WHEN I make a GET request to `/api/universities/{id}/summary` THEN the system SHALL return a plain text human-readable summary of the university
4. WHEN I make a GET request to `/api/questions/{id}/summary` THEN the system SHALL return a plain text human-readable summary of the question
5. WHEN I make a GET request to `/api/degrees/{id}/summary` THEN the system SHALL return a plain text human-readable summary of the degree

### Requirement 2

**User Story:** As an AI system, I want each entity type to have its own unique summary format, so that I can learn the specific characteristics and context relevant to each academic entity type.

#### Acceptance Criteria

1. WHEN any summary endpoint is called THEN the system SHALL return plain text content with Content-Type: text/plain
2. WHEN a course summary is requested THEN the response SHALL include course-specific information like prerequisites, modules and a summery for each module.
3. WHEN a university summary is requested THEN the response SHALL include university-specific information like faculties, courses
4. WHEN any summary endpoint is called THEN the system SHALL use proper HTTP status codes (200 for success, 404 for not found)
5. WHEN each entity type is summarized THEN the format SHALL be tailored to highlight the most important aspects of that entity type

### Requirement 3

**User Story:** As a user of the API, I want meaningful error handling, so that I can understand what went wrong when requests fail.

#### Acceptance Criteria

1. WHEN I request a non-existent entity ID THEN the system SHALL return a 404 status with a clear error message
2. WHEN I provide an invalid ID format THEN the system SHALL return a 400 status with validation error details
3. WHEN a server error occurs THEN the system SHALL return a 500 status with appropriate error information
4. WHEN the mutations are disabled and this affects the endpoint THEN the system SHALL handle this gracefully

### Requirement 4

**User Story:** As an AI system, I want the summary endpoints to include contextual relationship information based on the database schema, so that I can understand how entities relate to each other within the academic hierarchy.

#### Acceptance Criteria

1. WHEN I request a course summary THEN the system SHALL describe its university, associated degrees, modules, block relationships (prerequisites/postrequisites), and publication status
2. WHEN I request a module summary THEN the system SHALL describe its associated courses, questions, parent/sub-module hierarchy, and block relationships
3. WHEN I request a university summary THEN the system SHALL describe its faculties, degrees, and courses in natural language
4. WHEN I request a degree summary THEN the system SHALL describe its university, optional faculty assignment, and associated courses
5. WHEN I request a question summary THEN the system SHALL describe its type (selection/value/void), validation status, associated modules, answers, and question parts if applicable

### Requirement 5

**User Story:** As an AI system, I want the endpoints to provide content using only English text from the Translation model, so that I can consistently process academic content in a single language.

#### Acceptance Criteria

1. WHEN an entity has translation data THEN the system SHALL use only the en_text field for content in the summary
2. WHEN generating summaries THEN the system SHALL extract English text (en_text) from the Translation model for all names and descriptions
3. WHEN describing entities THEN the system SHALL use the actual English names and descriptions from the database
4. WHEN translation data is missing THEN the system SHALL indicate that no English translation is available
