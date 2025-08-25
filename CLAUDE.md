# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm run dev` - Start development server with watch mode
- `pnpm run start:dev` - Alias for dev command
- `pnpm run start:e2e` - Start server for e2e testing (port 3333 recommended)
- `pnpm run preview` - Build and run production preview

### Database

- `pnpm run generate` - Generate Prisma client (runs automatically before build/lint)
- `pnpm run prisma:migrate:dev` - Apply database migrations in development
- `pnpm run prisma:studio` - Open Prisma Studio database browser
- `pnpm run db:dump` - Export SQLite database to dump.sql
- `pnpm run db:dump:apply` - Import from dump.sql to database
- `pnpm run db:reset` - Reset database (destructive)

### Testing

- `pnpm run test` - Run unit tests
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run test:e2e` - Run end-to-end tests
- `pnpm run test:cov` - Run tests with coverage report
- `pnpm run test:ui` - Run tests with UI interface

### Code Quality

- `pnpm run lint` - Run ESLint with auto-fix
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting

### Build

- `pnpm run build` - Build application for production
- `pnpm run build:copy` - Copy build output to shared dist directory

## Architecture

This is a NestJS-based knowledge base API that provides both REST and GraphQL endpoints for managing educational content and questions. The application uses SQLite with Prisma ORM and follows Domain-Driven Design principles.

### Core Data Model

The system models educational hierarchy: **Institutions → Faculties → Degrees → Courses → Modules**, with a **Block** system for prerequisite relationships and **Questions** with multiple answer types.

### Working with Data

#### Service Setup for Data Operations

1. **Boot the service**: Use `PORT=3333 pnpm run preview` to start the service on port 3333
2. **Access APIs**:
   - REST API with Swagger: `http://localhost:3333/docs`
   - GraphQL Playground: `http://localhost:3333/graphql`
   - OpenAPI spec: `http://localhost:3333/openapi`
3. **Enable mutations**: Set `ENABLE_MUTATIONS=true` environment variable to allow data modifications

#### Question Generation Workflow

The system includes a specialized command for AI-generated questions:

- Use `pnpm run generate-questions-claude` to automatically generate questions for modules with the fewest questions
- Creates 74 questions across various difficulty levels
- Uses bulk endpoints (`/bulk-complete`) for efficient data creation
- Automatically creates corresponding answers based on question type

#### Bulk Operations

- Prefer bulk endpoints for creating multiple entities
- Use `/bulk-complete` endpoint for comprehensive question creation (questions + answers)
- Export/import data using `pnpm run db:dump` and `pnpm run db:dump:apply`

### Module Structure

Each domain module follows NestJS patterns with:

- **Controllers**: REST endpoints (`*.controller.ts`)
- **Resolvers**: GraphQL endpoints (`*.resolver.ts`)
- **Services**: Business logic (`*.service.ts`)
- **Models**: Entity definitions (`models/`)
- **DTOs**: Data transfer objects (`dto/`)

### Key Features

- **Mutations Guard**: Global guard that blocks mutations unless `ENABLE_MUTATIONS=true` is set
- **Dual API**: Both REST (Swagger at `/docs`) and GraphQL (at `/graphql`) interfaces
- **Translation Support**: Bilingual content (English/Hebrew) via Translation entities
- **Question System**: Multiple question types (selection, value, boolean, void) with validation status
- **Block Relationships**: Complex prerequisite system with metadata

### Environment Configuration

- Environment variables validated using Zod schema (`src/env/schema`)
- Mutations disabled by default for safety
- Database: SQLite (`prisma/main.db`)

### Testing Setup

- Vitest for unit and e2e tests
- Prismock for database mocking
- Tests run sequentially to avoid state races
- Coverage thresholds enforced

### Important Notes

- Use absolute imports (no file extensions)
- Unit tests go in same folder as source (`.spec.ts`)
- Follow early return pattern
- Use `const` over `let`, `unknown` over `any`
- Domain-driven folder structure within modules
- Always validate endpoint request data
