# Project Structure

## Root Directory

- `src/` - Main application source code
- `prisma/` - Database schema, migrations, and SQLite database
- `generated/` - Auto-generated files (Prisma client, JSON schema)
- `test/` - End-to-end tests
- `coverage/` - Test coverage reports
- `dist/` - Compiled output (build artifacts)

## Source Code Organization (`src/`)

### Core Application

- `main.ts` - Application entry point and bootstrap
- `app.module.ts` - Root application module
- `consts.ts` - Application constants

### Environment & Configuration

- `env/` - Environment variable validation and configuration
  - `schema.ts` - Zod schema for environment validation
  - `index.ts` - Environment loading and parsing

### Modules (`src/modules/`)

Each domain module follows consistent structure:

- `{module}.module.ts` - NestJS module definition
- `{module}.service.ts` - Business logic and data access
- `{module}.resolver.ts` - GraphQL resolver (queries/mutations)
- `models/` - Entity definitions with GraphQL and Swagger decorators
- `dto/` - Data Transfer Objects for inputs and outputs

#### Domain Modules

- `universities/` - University management
- `faculties/` - Faculty management
- `degrees/` - Degree program management
- `courses/` - Course management
- `modules/` - Learning module management
- `questions/` - Question and assessment management
- `blocks/` - Prerequisite relationship management
- `translations/` - Multilingual content support

### System Modules (`src/system/`)

- `health/` - Health check endpoints and indicators
- `database/` - Database management utilities

### Infrastructure

- `prisma/` - Prisma service and database connection
- `guards/` - Authentication and authorization guards
- `openapi/` - OpenAPI specification generation
- `swagger/` - Swagger UI setup

## File Naming Conventions

- **Entities**: `{Entity}.entity.ts` (PascalCase)
- **Services**: `{module}.service.ts` (kebab-case)
- **Resolvers**: `{module}.resolver.ts` (kebab-case)
- **Modules**: `{module}.module.ts` (kebab-case)
- **DTOs**: `{purpose}.{type}.ts` (kebab-case)
- **Tests**: `{file}.spec.ts` for unit tests, `{file}.e2e-spec.ts` for e2e tests

## Module Architecture Pattern

Each module follows NestJS conventions:

1. **Module** - Defines dependencies and exports
2. **Service** - Contains business logic and database operations
3. **Resolver** - GraphQL endpoint definitions
4. **Models** - Entity definitions with decorators
5. **DTOs** - Input/output type definitions

## Database Structure

- `prisma/schema.prisma` - Database schema definition
- `prisma/migrations/` - Database migration files
- `prisma/main.db` - SQLite database file
- `generated/client/` - Generated Prisma client

## Testing Structure

- Unit tests alongside source files (`*.spec.ts`)
- E2E tests in `test/e2e/` directory
- Coverage reports in `coverage/` directory
- Test configuration in `vitest.config.ts`
