# Technology Stack

## Core Framework & Runtime

- **NestJS**: Progressive Node.js framework for building scalable server-side applications
- **Node.js**: JavaScript runtime environment
- **TypeScript**: Primary programming language with strict type checking

## Database & ORM

- **SQLite**: Database engine (file-based: `prisma/main.db`)
- **Prisma**: Database ORM and query builder
- **Generated Client**: Located in `generated/client/`

## API Technologies

- **GraphQL**: Primary API interface using Apollo Server
- **REST API**: OpenAPI/Swagger documentation
- **Apollo Server**: GraphQL server implementation

## Package Management

- **pnpm**: Package manager (not npm or yarn)
- **pnpm workspaces**: Monorepo configuration

## Testing

- **Vitest**: Test runner and framework
- **Supertest**: HTTP assertion library for e2e tests
- **Prismock**: Prisma mocking for tests
- **Coverage**: v8 provider with thresholds (55% lines, 50% branches)

## Code Quality

- **ESLint**: Linting with TypeScript ESLint
- **Prettier**: Code formatting (single quotes, trailing commas)
- **TypeScript**: Strict configuration with decorators enabled

## Common Commands

### Development

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start development server with watch mode
pnpm run start        # Start server
pnpm run build        # Build for production
```

### Database

```bash
pnpm run generate           # Generate Prisma client
pnpm run prisma:migrate:dev # Run database migrations (dev)
pnpm run prisma:studio      # Open Prisma Studio
pnpm run db:reset           # Reset database
```

### Testing

```bash
pnpm run test         # Run unit tests
pnpm run test:watch   # Run tests in watch mode
pnpm run test:cov     # Run tests with coverage
pnpm run test:e2e     # Run end-to-end tests
```

### Code Quality

```bash
pnpm run lint         # Run ESLint with auto-fix
pnpm run format       # Format code with Prettier
pnpm run type-check   # TypeScript type checking
```

## Environment Configuration

- Environment variables validated with Zod schema
- Configuration in `src/env/schema.ts`
- Supports development, test, and production modes
- CORS configuration optional via `CORS_ORIGIN`
- Mutations can be disabled via `ENABLE_MUTATIONS` flag
